/**
 * Every outbound target in one place.
 *
 * The design library says target URLs are still to be confirmed
 * ("Ziel-URLs und Routing sind noch zu bestätigen"), so this file is the single
 * place to fix them rather than hunting through components.
 *
 * Wiki links are absolute and open in a new tab. Site links point at the pages
 * that exist today on nextsociety.ieb.net; swap them for internal routes as this
 * site grows those pages.
 */
export const wiki = {
  root: "https://next.ieb.net",
  society: "https://next.ieb.net/s/society",
  education: "https://next.ieb.net/s/education",
  democracy: "https://next.ieb.net/s/democracy",
  economy: "https://next.ieb.net/s/economy",
  // TODO: /s/research does not exist yet (next.infra issue #20).
} as const;

export const site = {
  philosophy: "/philosophy",
  mission: "/mission",
  playbook: "/playbook",
  press: "/press",
  about: "/about",
  imprint: "/imprint",
  // German is not built here yet. Until it is, the switch points at the existing
  // German mirror on the old site rather than at a page that does not exist.
  de: "https://nextsociety.ieb.net/de/index.html",
} as const;

/** True for anything that leaves this site, so the arrow and rel are consistent. */
export const isExternal = (href: string) => /^https?:\/\//.test(href);
