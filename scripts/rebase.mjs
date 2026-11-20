/**
 * Rewrites root-absolute URLs in the built site so it can be served from a subpath.
 *
 * Why a post-build pass rather than Astro's `base` option: the site's internal links
 * come from three places — components, `src/content/links.ts`, and the wiki markdown
 * rendered at build time — and only the first would pick up `import.meta.env.BASE_URL`
 * without threading a helper through every call site, including the fetch script's
 * link rewriter. One pass over the output catches all of them, including Astro's own
 * asset paths and url() references inside CSS.
 *
 * No BASE_PATH means no rewriting, so a root deployment is untouched.
 *
 *   BASE_PATH=/next-society-web node scripts/rebase.mjs
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const base = (process.env.BASE_PATH || "").replace(/\/+$/, "");
if (!base) {
  console.log("rebase: no BASE_PATH set, nothing to do");
  process.exit(0);
}
if (!base.startsWith("/")) {
  console.error(`rebase: BASE_PATH must start with "/" (got ${base})`);
  process.exit(1);
}

const dist = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");

/** Files whose contents can carry URLs. */
const REWRITABLE = new Set([".html", ".css", ".js", ".xml", ".json", ".txt"]);

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) yield* walk(path);
    else yield path;
  }
}

// Attribute values and CSS url() only: never bare text, so prose that happens to
// mention a path is left alone. `//` is excluded so protocol-relative URLs survive.
const PATTERNS = [
  [/((?:href|src|action|data-toc-link-href)=")\/(?!\/)/g, `$1${base}/`],
  [/((?:srcset|imagesrcset)="[^"]*?)\/(?!\/)/g, `$1${base}/`],
  [/(url\(['"]?)\/(?!\/)/g, `$1${base}/`],
  [/("(?:url|link)":\s*")\/(?!\/)/g, `$1${base}/`],
];

let files = 0;
let edits = 0;

for (const path of walk(dist)) {
  const ext = path.slice(path.lastIndexOf("."));
  if (!REWRITABLE.has(ext)) continue;

  const before = readFileSync(path, "utf8");
  let after = before;
  for (const [pattern, replacement] of PATTERNS) after = after.replace(pattern, replacement);

  if (after !== before) {
    writeFileSync(path, after);
    files += 1;
    edits += after.split(base + "/").length - before.split(base + "/").length;
  }
}

console.log(`rebase: ${edits} urls rewritten under ${base} across ${files} files`);
