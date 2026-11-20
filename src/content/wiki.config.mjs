/**
 * What the website renders from the wiki.
 *
 * The website points at wiki places; the wiki stays free to reorganise. Pointers
 * are share slugs (human-set, stable across renames), never UUIDs, so this file
 * reviews readably in a pull request.
 *
 * `required: true` fails the build when a pointer does not resolve. The main
 * failure mode of this design is quietly publishing an empty page after someone
 * moves or renames a wiki document, so unresolved pointers are loud by default.
 */
export const collections = [
  { slug: "start", share: "society", brand: "society", title: "Start here", required: true },
  { slug: "compendium", share: "compendium", brand: "society", title: "Compendium", required: true },
  { slug: "education", share: "education", brand: "education", title: "Next.Education", required: true },
  { slug: "democracy", share: "democracy", brand: "democracy", title: "Next.Democracy", required: true },
  { slug: "economy", share: "economy", brand: "economy", title: "Next.Economy", required: true },
  // Next.Research has no share yet (next.infra issue #20). required:false means
  // the build notes it and carries on instead of failing.
  { slug: "research", share: "research", brand: "society", title: "Next.Research", required: false },
];

/**
 * The publish gate.
 *
 * Status comes from the header table every wiki page carries:
 *   | Owner: | Status: Garden | Reviewed: |
 * Values in use: Jungle (wild, drafts, open questions), Garden (tended), Park (polished).
 *
 * Everything here is already public: these are *published shares*, readable by
 * anyone at next.ieb.net without a login. Mirroring them leaks nothing new. The
 * gate is editorial, not a security boundary — it keeps the wild pages off the
 * website, not off the internet.
 *
 * Set to ["Jungle"] to hide drafts. Set to ["Jungle", "Garden"] to show only Park.
 */
export const hideStatus = ["Jungle"];

/** Pages whose checklists are working material rather than public content. */
export const skipTitles = ["Tasks", "Meetings"];

export const wikiBase = "https://next.ieb.net";
