/**
 * Home page copy, verbatim from the Figma 3.5 Final English desktop frame.
 *
 * Kept as data, not markup, because the plan is for this to come from the Outline
 * wiki later (see the wiki-as-backend notes). When that lands, this module is what
 * the generator replaces; the components do not change.
 */
import { site, wiki } from "./links";

export const nav = {
  items: [
    // The Figma frame has an unlinked "Explore" here. It is named for where it
    // goes instead: the Compendium, rendered from the wiki on this site. The theme
    // cards still go to the wiki itself, as designed.
    { label: "Compendium", href: "/compendium" },
    { label: "Philosophy", href: site.philosophy },
    { label: "Mission", href: site.mission },
    { label: "Playbook", href: site.playbook },
  ],
  cta: { label: "Get involved", href: wiki.root },
};

export const hero = {
  eyebrow: "A humanistic societal operating system",
  headline:
    "A living manifesto for organizing business around flourishing, written by the people already doing it.",
  actions: [
    { label: "Read the wiki", href: wiki.root, appearance: "inverse" as const },
    { label: "Get involved", href: wiki.root, appearance: "filled" as const },
  ],
};

export const idea = {
  eyebrow: "01 / THE IDEA",
  title: "What it is",
  body: "The Next. Society is a shared, evolving body of work about a simple question. What changes when an economy is organized around flourishing rather than extraction. It is not a book by one author. It is a collective effort by practitioners, consultants, and organizations who already run their work this way and are putting what they know into one place.",
};

export const themes = {
  eyebrow: "02 / EXPLORE THE THEMES",
  title: ["One society.", "Three perspectives."],
  intro: ["Find your starting point here.", "Go deeper in the wikis."],
  cards: [
    {
      brand: "education" as const,
      headline: ["Knowledge grows", "through exchange."],
      category: "01 / LEARNING",
      linkLabel: "Read the wiki",
      href: wiki.education,
      image: "/assets/card-education.jpg",
      alt: "Cut paper illustration of an open book with fanned pages",
    },
    {
      brand: "democracy" as const,
      headline: ["Participation starts", "with listening."],
      category: "02 / DIALOGUE",
      linkLabel: "Read the wiki",
      href: wiki.democracy,
      image: "/assets/card-democracy.jpg",
      alt: "Cut paper illustration of two faces turned towards each other",
    },
    {
      brand: "economy" as const,
      headline: ["Rethinking the economy.", "Seeing the connections."],
      category: "03 / CONNECTIONS",
      linkLabel: "Read the wiki",
      href: wiki.economy,
      image: "/assets/card-economy.jpg",
      alt: "Cut paper illustration of a rope tied in a knot",
    },
  ],
};

export const manifesto = {
  eyebrow: "03 / THE MANIFESTO",
  title: "The three dimensions",
  intro: "The work is organized in three dimensions, each developed openly in the wiki.",
  dimensions: [
    {
      number: "01",
      title: "Philosophy",
      href: site.philosophy,
      body: "The ideas and theory beneath the movement. Why flourishing is a serious economic aim and what it asks us to rethink.",
    },
    {
      number: "02",
      title: "Mission",
      href: site.mission,
      body: "The transformation the work is trying to drive, and what it would mean for how organizations are led and how decisions get made.",
    },
    {
      number: "03",
      title: "Playbook",
      href: site.playbook,
      body: "The practical patterns practitioners can apply, drawn from real work inside real organizations.",
    },
  ],
};

export const participation = {
  eyebrow: "04 / OPEN TO EVERYONE",
  title: "Read the work in the wiki, or find your way to take part.",
  body: "Reading is open to everyone.",
  actions: [
    { label: "Read the wiki", href: wiki.root, appearance: "filled" as const },
    { label: "Get involved", href: wiki.root, appearance: "outline" as const },
  ],
};

export const footer = {
  statement: "Next.Society. A living, practitioner-led manifesto.",
  openLine: { label: "Built in the open at next.ieb.net", href: wiki.root },
  links: [
    { label: "Press Kit", href: site.press },
    { label: "About Us", href: site.about },
    { label: "Imprint", href: site.imprint },
  ],
  colophon: "NEXT. SOCIETY / IEB",
};

export const meta = {
  title: "Next. Society — A living manifesto",
  description:
    "A living manifesto for organizing business around flourishing, written by the people already doing it.",
  lang: "en",
};
