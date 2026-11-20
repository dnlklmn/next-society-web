/**
 * Fetches the wiki into src/data/wiki.json and mirrors its images into
 * public/assets/wiki/.
 *
 * Why a prebuild step rather than fetching inside the page components:
 *
 * 1. The rendered site is then a pure function of (wiki.config + wiki.json), so a
 *    build is reproducible and works offline once the data is there.
 * 2. wiki.json is committed, so a wiki edit shows up in review as the prose that
 *    will actually ship. The diff is the review artefact.
 * 3. Image URLs from Outline are presigned S3 links that EXPIRE. Anything that
 *    referenced them at runtime would 403 within days. They have to be mirrored.
 *
 * No API token: shares.info and documents.info both accept unauthenticated reads
 * for published shares, so this runs in CI without production credentials.
 */
import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { collections, hideStatus, skipTitles, wikiBase } from "../src/content/wiki.config.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const imageDir = join(root, "public", "assets", "wiki");
const outFile = join(root, "src", "data", "wiki.json");

const log = (...args) => console.log("fetch-wiki:", ...args);

async function api(endpoint, body) {
  const res = await fetch(`${wikiBase}/api/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${endpoint} ${res.status} ${res.statusText}`);
  return (await res.json()).data;
}

/** "/doc/what-are-economies-actually-for-NDgo2fasfc" -> "what-are-economies-actually-for" */
function docSlug(url, fallback) {
  const tail = String(url || "").split("/doc/")[1];
  if (!tail) return fallback;
  const parts = tail.split("-");
  // The last segment is Outline's urlId. Drop it so the slug reads as prose, but
  // keep it when the title was only the id.
  return parts.length > 1 ? parts.slice(0, -1).join("-") : tail;
}

/**
 * Parses and removes the owner header table that every wiki page starts with:
 *   | Owner: Name | Status: Garden | Reviewed: 2026-11-11 |
 *   |:------------|:-------------:|---------------------:|
 * Outline has no typed fields, so this table is the metadata convention. It is
 * content as far as the API is concerned, which is why it has to be stripped.
 */
function extractHeader(markdown) {
  const lines = markdown.split("\n");
  let i = 0;
  while (i < lines.length && lines[i].trim() === "") i++;

  const header = lines[i];
  if (!header || !/^\s*\|/.test(header) || !/Status:/i.test(header)) {
    return { meta: {}, body: markdown };
  }

  const cells = header.split("|").map((c) => c.trim()).filter(Boolean);
  const meta = {};
  for (const cell of cells) {
    const match = cell.match(/^(Owner|Status|Reviewed)\s*:\s*(.*)$/i);
    if (match) {
      const value = match[2].replace(/\*/g, "").trim();
      if (value) meta[match[1].toLowerCase()] = value;
    }
  }

  // Drop the header row and the alignment row beneath it.
  let drop = i + 1;
  if (lines[drop] && /^\s*\|[\s:|-]+\|\s*$/.test(lines[drop])) drop++;
  return { meta, body: lines.slice(drop).join("\n").trim() };
}

/** Outline user mentions render as raw markup otherwise. Keep the name, drop the link. */
function stripMentions(markdown) {
  return markdown.replace(/@\[([^\]]*)\]\(mention:\/\/[^)]*\)/g, "$1");
}

async function mirrorImage(url) {
  const hash = createHash("sha256").update(url.split("?")[0]).digest("hex").slice(0, 16);
  const ext = (url.split("?")[0].match(/\.(png|jpe?g|gif|webp|svg)$/i) || [, "png"])[1].toLowerCase();
  const name = `${hash}.${ext}`;
  const target = join(imageDir, name);

  if (!existsSync(target)) {
    const res = await fetch(url);
    if (!res.ok) {
      log(`WARN image ${res.status} ${url.slice(0, 80)}`);
      return null;
    }
    writeFileSync(target, Buffer.from(await res.arrayBuffer()));
    log(`mirrored ${name}`);
  }
  return `/assets/wiki/${name}`;
}

/** Rewrites image URLs to the mirrored copies. Presigned S3 links expire otherwise. */
async function mirrorImages(markdown) {
  const pattern = /!\[([^\]]*)\]\(([^)\s]+)(\s+"[^"]*")?\)/g;
  const found = [...markdown.matchAll(pattern)];
  let out = markdown;
  let count = 0;

  for (const match of found) {
    const [full, alt, url] = match;
    if (!/^https?:\/\//.test(url)) continue;
    const local = await mirrorImage(url);
    if (!local) continue;
    out = out.replace(full, `![${alt}](${local})`);
    count++;
  }
  return { markdown: out, images: count };
}

/**
 * Rewrites wiki-internal links. Three cases:
 *   - points at a document this site renders  -> internal route
 *   - points anywhere else in the wiki        -> absolute next.ieb.net URL
 *   - already absolute                        -> untouched
 */
function rewriteLinks(markdown, routeByUrlId) {
  // Outline's editor writes cross-links both ways: relative ("/doc/charter-10Mq…")
  // and absolute ("https://next.ieb.net/s/society/doc/charter-10Mq…"). Both have to
  // be internalised, or a page this site renders still sends the reader off-site.
  const routeFor = (href) => {
    const afterDoc = href.split("/doc/")[1];
    if (!afterDoc) return null;
    const urlId = afterDoc.split(/[/?#]/)[0].split("-").pop();
    return (urlId && routeByUrlId.get(urlId)) || null;
  };

  return markdown.replace(/(!?)\[([^\]]*)\]\(([^)\s]+)\)/g, (full, bang, label, href) => {
    if (bang) return full; // images are mirrored elsewhere
    if (href.startsWith("/")) {
      const route = routeFor(href);
      return `[${label}](${route || wikiBase + href})`;
    }
    if (href.startsWith(wikiBase)) {
      const route = routeFor(href);
      return route ? `[${label}](${route})` : full;
    }
    return full; // genuinely external (Zulip, press, third parties)
  });
}

function flattenTree(node, depth = 0, acc = []) {
  for (const child of node.children || []) {
    acc.push({ id: child.id, title: child.title, url: child.url, depth });
    flattenTree(child, depth + 1, acc);
  }
  return acc;
}

/**
 * Lifts a collection that hangs off a single wrapper document.
 *
 * The Compendium is shaped Compendium (collection) > Compendium (document) >
 * Part 1, Part 2, ..., so every page reads as Compendium inside Compendium and the
 * parts sit a level deeper than they are. Every other collection puts its documents
 * at the root. This levels the odd one out: the wrapper stays as the collection's
 * opening document and its children come up to sit beside it.
 *
 * Presentation only, and self-disabling: the rule needs exactly one root document
 * with children, so once the wiki itself is restructured (move the parts to the
 * collection root in Outline) this stops applying and nothing here changes.
 */
function liftSingleRoot(docs) {
  const roots = docs.filter((doc) => doc.depth === 0);
  if (roots.length !== 1 || docs.length < 2) return docs;

  return docs.map((doc) => (doc.depth === 0 ? doc : { ...doc, depth: doc.depth - 1 }));
}

async function main() {
  mkdirSync(imageDir, { recursive: true });
  mkdirSync(dirname(outFile), { recursive: true });

  const missing = [];

  // Pass 1: resolve every pointer to a share and its document tree.
  const resolved = [];
  for (const collection of collections) {
    let share;
    try {
      share = await api("shares.info", { id: collection.share });
    } catch (err) {
      missing.push({ ...collection, error: err.message });
      continue;
    }
    const tree = share.sharedTree || {};
    const docs = liftSingleRoot(flattenTree(tree)).map((doc) => ({
      ...doc,
      urlId: (doc.url.split("/doc/")[1] || "").split("-").pop(),
      slug: docSlug(doc.url, doc.id),
    }));
    resolved.push({ collection, share: share.shares[0], tree, docs });
  }

  const failures = missing.filter((m) => m.required);
  if (failures.length) {
    for (const f of failures) console.error(`fetch-wiki: FAILED required pointer "${f.share}": ${f.error}`);
    process.exit(1);
  }
  for (const m of missing) log(`skipped optional pointer "${m.share}" (${m.error})`);

  // Pass 2: fetch every document and apply the publish gate.
  //
  // Status lives inside the markdown, so the gate cannot be evaluated until the
  // text is in hand. Routes are therefore built in pass 3, from the published set
  // only: linking to a gated-out page would 404.
  for (const entry of resolved) {
    entry.fetched = [];
    for (const doc of entry.docs) {
      const info = await api("documents.info", { shareId: entry.collection.share, id: doc.id });
      const { meta, body } = extractHeader(info.text || "");
      const status = meta.status || "";
      const hidden =
        hideStatus.some((s) => s.toLowerCase() === status.toLowerCase()) ||
        skipTitles.includes(info.title);

      if (hidden) {
        log(`hidden  ${entry.collection.slug}/${doc.slug} (status=${status || "none"})`);
        continue;
      }
      entry.fetched.push({ doc, info, meta, body, status });
    }
  }

  // Pass 3: routes for published documents only, then rewrite and mirror.
  const routeByUrlId = new Map();
  for (const { collection, fetched } of resolved) {
    for (const { doc } of fetched) routeByUrlId.set(doc.urlId, `/${collection.slug}/${doc.slug}`);
  }

  const result = { collections: [], documents: [] };

  for (const { collection, share, fetched } of resolved) {
    const entries = [];

    for (const { doc, info, meta, body, status } of fetched) {
      const linked = rewriteLinks(stripMentions(body), routeByUrlId);
      const { markdown, images } = await mirrorImages(linked);

      entries.push({
        slug: doc.slug,
        title: info.title,
        depth: doc.depth,
        urlId: doc.urlId,
        wikiUrl: `${wikiBase}/s/${collection.share}/doc/${doc.url.split("/doc/")[1]}`,
        revision: info.revision ?? null,
        status,
        owner: meta.owner || "",
        reviewed: meta.reviewed || "",
        images,
        markdown,
      });
      log(`ok      ${collection.slug}/${doc.slug} rev=${info.revision} status=${status || "none"} images=${images}`);
    }

    result.collections.push({
      slug: collection.slug,
      share: collection.share,
      brand: collection.brand,
      title: collection.title,
      wikiTitle: share.sourceTitle,
      wikiUrl: share.url,
      documents: entries,
    });
  }

  // Link integrity. A wiki edit that un-publishes a page others link to would
  // otherwise ship a 404 quietly, which is the failure mode this whole design is
  // meant to avoid. Fail the build instead.
  const routes = new Set();
  for (const c of result.collections) {
    routes.add(`/${c.slug}`);
    for (const d of c.documents) routes.add(`/${c.slug}/${d.slug}`);
  }

  const broken = [];
  for (const c of result.collections) {
    for (const d of c.documents) {
      // (?<!!) skips image embeds; mirrored assets are files, not routes.
      for (const match of d.markdown.matchAll(/(?<!!)\[[^\]]*\]\((\/[^)\s]*)\)/g)) {
        const href = match[1].split("#")[0];
        if (href.startsWith("/assets/")) continue;
        if (!routes.has(href)) broken.push({ from: `/${c.slug}/${d.slug}`, to: href });
      }
    }
  }

  if (broken.length) {
    for (const b of broken) console.error(`fetch-wiki: BROKEN internal link ${b.from} -> ${b.to}`);
    console.error("fetch-wiki: internal links must resolve to generated pages");
    process.exit(1);
  }

  // Deterministic output: no timestamps, stable key order, so re-running on
  // unchanged content produces a zero-line diff.
  writeFileSync(outFile, JSON.stringify(result, null, 2) + "\n");

  const total = result.collections.reduce((n, c) => n + c.documents.length, 0);
  log(`wrote src/data/wiki.json — ${result.collections.length} collections, ${total} documents, links ok`);
}

main().catch((err) => {
  console.error("fetch-wiki: fatal", err);
  process.exit(1);
});
