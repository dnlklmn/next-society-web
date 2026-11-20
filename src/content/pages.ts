/**
 * Copy for the pages the old static site had, ported into the new design.
 *
 * Text is verbatim from nextsociety.ieb.net, with one exception noted below.
 * Treated as data for the same reason as home.ts: these pages are candidates to
 * come from the wiki later.
 *
 * NAMING CONFLICT, UNRESOLVED
 * The old About and Press copy calls the whole project "The Next Economy". The 3.5
 * design renames the whole to "Next. Society" and makes Next.Economy one of three
 * missions alongside Education and Democracy. The text below is the original, so
 * these pages currently describe the project under its previous name. This is
 * next.infra issue #41 ("Website texts (Mission 4, Next Economy wording)"). It is a
 * copy decision, not a code one: fix the strings here once the wording is settled.
 */
import { wiki, site } from "./links";

const readAndContribute = {
  title: "Read and contribute",
  body: "This dimension is written and revised openly in the wiki. Read the current thinking, comment, or take ownership of a section.",
};

const dimensionActions = [
  { label: "Read the wiki", href: wiki.root, appearance: "filled" as const },
  { label: "Get involved", href: wiki.root, appearance: "outline" as const },
];

export const philosophy = {
  number: "01",
  slug: "philosophy",
  title: "Philosophy",
  lead: "The ideas and theory beneath the movement. Why flourishing is a serious economic aim, and what it asks us to rethink.",
  actions: dimensionActions,
  sections: [
    {
      title: "What it covers",
      body: "Philosophy makes the movement's assumptions explicit: a humanistic account of value, the case for augmentation over automation, and a clear answer to what an economy is actually for. It is the ground that the missions and the playbook stand on.",
    },
    readAndContribute,
  ],
  related: { label: "Read Part 1: Leitmotif in the Compendium", href: "/compendium/part-1-leitmotif" },
};

export const mission = {
  number: "02",
  slug: "mission",
  title: "Mission",
  lead: "The transformation the work is trying to drive, and what it would mean for how organizations are led and how decisions get made.",
  actions: dimensionActions,
  sections: [
    {
      title: "What it covers",
      body: "Mission turns philosophy into direction: education as the engine of capability, economic architecture beyond GDP, and democratic governance fit for the third millennium. It names the shifts that move us from today's economy to the next one.",
    },
    readAndContribute,
  ],
  related: { label: "Read Part 2: Missions in the Compendium", href: "/compendium/part-2-missions" },
};

export const playbook = {
  number: "03",
  slug: "playbook",
  title: "Playbook",
  lead: "The practical patterns practitioners can apply, drawn from real work inside real organizations.",
  actions: dimensionActions,
  sections: [
    {
      title: "What it covers",
      body: "Playbook is the hands-on layer: templates, patterns and field-tested practices for teams ready to transition. Less manifesto, more method — what to do on Monday morning.",
    },
    readAndContribute,
  ],
  related: { label: "Read Part 3: Playbooks in the Compendium", href: "/compendium/part-3-playbooks" },
};

export const about = {
  eyebrow: "ABOUT US",
  title: "About Us",
  sections: [
    {
      title: "What this is",
      body: "The Next Economy is a collective manifesto rather than a single author's argument. It brings together people who already run their organizations, advise their clients, and build their communities around flourishing instead of pure extraction, and it consolidates that scattered practice into one shared, living document.",
    },
    {
      title: "How it is made",
      body: "The manifesto is written collaboratively in an open wiki. Contributions are proposed, discussed, and committed in the open, so the work grows without losing anyone's voice or earlier thinking. The result is closer to a tended garden than a finished publication. It keeps changing as more practitioners bring their experience in.",
    },
    {
      title: "How to take part",
      body: "There is a role sized to whatever you can give. Some people contribute occasionally on a single topic they know well. Some co-author and take ownership of a section. Organizations join as partners and bring their practice, their reach, and their reference work. Reading is open to everyone. Commenting needs a free account. Contributing and partnering begin with a short registration, so we can say hello before opening access.",
    },
    {
      title: "The wider picture",
      body: "The Next Economy is one mission within a broader exploration of how societies could be organized differently. That wider frame is still taking shape with the community. For now, this is where the work is most alive, and the clearest place to begin.",
    },
  ],
};

export const press = {
  eyebrow: "PRESS KIT",
  title: "Press Kit",
  sections: [
    {
      title: "In one line",
      body: "The Next Economy is a living, practitioner-led manifesto for organizing business around flourishing.",
    },
    {
      title: "Short description",
      body: "The Next Economy is a collective, open manifesto written by practitioners, consultants, and organizations who already build their work around flourishing rather than extraction. It consolidates scattered practice into one shared, evolving body of work, developed openly in a public wiki.",
    },
    {
      title: "Long description",
      body: "The Next Economy is a living manifesto and a growing movement. Rather than being authored by one voice, it is built collaboratively by people who already run organizations, advise clients, and lead communities around a different idea of value, one centered on what makes people and the planet thrive. The work is organized in three dimensions. Philosophy sets out the ideas beneath the movement. Mission describes the transformation it aims to drive. Playbook collects the practical patterns practitioners can apply. All of it is developed in the open, in a public wiki that anyone can read and that contributors and partners help write.",
    },
  ],
  facts: {
    title: "Key facts",
    items: [
      "The Next Economy is a collective manifesto and movement, not a company or a single-author publication.",
      "It is produced collaboratively in an open wiki at next.ieb.net.",
      "Reading is open to all, commenting requires a free account, and contributing or partnering begins with a short registration.",
      "The project launches in English and German.",
    ],
  },
  assets: {
    title: "Assets",
    body: "The logo and brand assets are available below in vector and raster formats, bundled as a single download. Please keep the logo clear of other marks and do not alter its proportions or color.",
    downloads: [
      { label: "Logo — SVG", href: "/assets/press/logo.svg" },
      { label: "Logo — PNG", href: "/assets/press/logo.png" },
      { label: "Download press kit", href: "/assets/press/next-economy-press-kit.zip", primary: true },
    ],
  },
  // The old page shipped this placeholder live. Carried over rather than invented.
  contact: { title: "Press contact", body: "[Confirm name], [confirm email]" },
};

/**
 * Imprint. German legal text, reproduced exactly as the old site had it, including
 * the formal headings. Nothing here is translated or reworded: it is a legal notice
 * under German law (§5 TMG / §10 Abs. 3 MDStV) and the wording is not ours to edit.
 * Rendered inside a lang="de" block so screen readers switch voice.
 */
export const imprint = {
  eyebrow: "IMPRINT",
  title: "Imprint",
  lang: "de",
  sections: [
    {
      title: "Anbieter",
      lines: [
        "Institute of Electronic Business e.V.",
        "Fasanenstraße 86",
        "10623 Berlin",
      ],
    },
    {
      title: "Kontakt",
      lines: [
        "Telefon: +49 (0)30 72 62 983-0",
        "Telefax: +49 (0)30 72 62 983-9",
        "E-Mail: info@ieb.net",
        "Internet: www.ieb.net",
      ],
    },
    {
      title: "Vertretungsberechtigter Vorstand",
      lines: ["Axel Deniz (Vorsitzender), Dr. Christoph Regierer, Manuela Eisenhardt, Prof. Dr. Markus Hilgert"],
    },
    {
      title: "Registereintrag",
      lines: ["Registergericht: Amtsgericht 14507 Berlin-Charlottenburg", "Registernummer: 19106 VR"],
    },
    {
      title: "Umsatzsteuer-Identifikationsnummer gem. § 27a UStG",
      lines: ["DE 205 129 917"],
    },
    {
      title: "Inhaltlich Verantwortlicher gemäß §10 Absatz 3 MDStV",
      lines: ["Vorstand des IEB e.V. (Adresse s.o.)"],
    },
    {
      title: "Urheberrecht",
      lines: [
        "© 2026 IEB e.V. – alle Rechte vorbehalten.",
        "Vervielfältigung nur mit schriftlichem Einverständnis des IEB.",
        "Die Texte, Bilder, Graphiken und sonstige Dateien unterliegen dem Urheberrecht und weiteren Gesetzen zum Schutz geistigen Eigentums.",
      ],
    },
    {
      title: "Haftung",
      lines: [
        "Auf unseren Internet-Seiten befinden sich Links zu anderen Seiten im Internet. Wir möchten Sie darauf hinweisen, dass wir keinen Einfluss auf die Gestaltung und den Inhalt der verlinkten Seiten haben. Wir können daher auch keine Gewähr für die Aktualität, Korrektheit, Vollständigkeit oder Qualität der dort bereitgestellten Informationen übernehmen. Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich. Vor diesem Hintergrund distanzieren wir uns hiermit ausdrücklich von allen Inhalten dieser Seiten.",
      ],
    },
  ],
};

export const takePart = {
  eyebrow: "04 / OPEN TO EVERYONE",
  title: "Read the work in the wiki, or find your way to take part.",
  body: "Reading is open to everyone.",
  actions: [
    { label: "Read the wiki", href: wiki.root, appearance: "filled" as const },
    { label: "Get involved", href: wiki.root, appearance: "outline" as const },
  ],
};

export { site };
