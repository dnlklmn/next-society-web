# Next. Society — website

Astro static site built from the Figma library **"Next. Society · Design Library · 3.5"**
(file `9wmqz40Co3AcMb6QQm3Uuq`). Every page is a real static file; the only JavaScript
is Astro's client router (5.7 KB gzip) plus two small inline scripts.

```bash
npm run dev      # http://localhost:4321
npm run build    # -> dist/
npm run preview
```

Node 24 is required (Astro needs >= 22.23.4). There is an `.nvmrc`; `nvm use` before running.

## Layout

```
src/styles/tokens.css      68 design tokens, read from bound Figma variables
src/styles/global.css      Tailwind v4 theme mapping, type roles, page shell
src/components/            the component library (see below)
src/content/home.ts        all page copy, as data
src/content/links.ts       every outbound URL, in one place
src/layouts/Base.astro     document shell, meta, skip link
src/pages/index.astro      the home page: six sections, nothing else
public/assets/             artwork exported from Figma
```

## Behaviour

The header is **sticky on every page, and never changes colour**. Over the home page
hero it carries the hero's own ground (`--ns-surface-hero`), so at the top of the page
it is indistinguishable from what sits behind it and stays exactly that colour once
stuck over the pale sections below. On other pages it is paper from the start. Because
a sticky header occupies flow, the hero pulls up by `--ns-header-h` to keep the
design's overlay look.

Moving between pages is **client-side**: the router swaps the document instead of
reloading, so reading through the Compendium does not flash. The contents list is
persisted across navigations (per collection, so moving between collections renders a
fresh list), which needs two things done by hand: the highlight is moved to match the
URL, and the list's scroll offset is saved before the swap and restored after, because
moving a DOM node into a new document resets its scrollTop. Without scripting every URL
is still a plain static page and the links are ordinary links.

Below `lg` the navigation collapses into a menu. It is a `<details>`, so it opens
and closes natively with **no JavaScript at all**. One small inline script
(roughly 700 bytes, no framework, no bundle) adds the polish: Escape to close,
closing on an outside click, closing when the viewport grows past the breakpoint,
and the `data-scrolled` / `data-menu-open` flags the header's ground responds to.
Remove the script and everything still works, just less smoothly. This is the one
place the site ships script; there is no other JavaScript.

This departs from the library note that mobile reduces to brand plus a wiki link.
With six destinations to carry, a collapsed menu does the job better.

## Component library

Built with shadcn's *ergonomics* (copy-in source you own, variant props, tokens as
CSS variables) but without React, Radix or Tailwind's component layer. This is a
content site: the whole home page needs no client JavaScript, and adding React to
render a styled `<a>` would throw away the main reason to use Astro. If interactive
UI arrives later, add a React island with Radix or Base UI then; the token layer
below does not change.

| Component | Figma source | Notes |
|---|---|---|
| `Button.astro` | `NS 3.5/Action/Button` (0:518 / 0:531 / 0:544) | Props mirror Figma: `appearance`, `size`, `label`, `showArrow`. `State` is CSS, not a prop. Renders `<a>` or `<button>`, never a `div`. |
| `BrandLockup.astro` | `NS 3.5/Brand/*` (0:178, 0:261, …) | `brand` and `tone` (light = contrast version on dark ground). |
| `WikiCard.astro` | `NS 3.5/Card/Wiki` (0:590 / 0:606 / 0:622) | One `<a>` for the whole card, no nested links, per the Figma note. |
| `SiteHeader.astro` | `NS 3.5/Section/Navigation` (0:781 / 0:790) | |
| `SectionHero.astro` | `NS 3.5/Section/Hero` (0:795 / 0:802) | Separate desktop and mobile compositions. |
| `SectionIdea.astro` | `NS 3.5/Section/Idea` (0:811 / 0:815) | |
| `SectionThemes.astro` | frame 05 Subbrand cards | |
| `SectionManifesto.astro` | `NS 3.5/Section/Manifesto` (0:821 / 0:834) | |
| `SectionParticipation.astro` | `NS 3.5/Section/Participation` (0:852 / 0:859) | |
| `SiteFooter.astro` | `NS 3.5/Section/Footer` (0:868 / 0:877) | |

## Tokens

`tokens.css` is generated from the bound Figma variables, not eyeballed: 4 brand
colours, 3 ink/line values, 7 surfaces, the 4px space scale, layout sizes, 11 type
roles with desktop and mobile values, and the Cut Paper material.

`global.css` maps them into Tailwind's theme with `@theme inline`, so the CSS
variables stay the single source of truth and utilities such as `bg-paper`,
`text-ink-muted` or `border-line` follow automatically.

A useful check that the system is coherent: `3 x 410.667 + 2 x 24 = 1280`, so the
card width *is* the 3-up grid at desktop content width.

## Deliberate deviations from the file

Each one is a judgement call, not an oversight. Reverse any of them freely.

1. **Fluid type instead of two fixed sizes.** The library gives a value at 1440 and
   one at 390 and says those are reference widths, *not* breakpoints, with
   intermediate behaviour still to be agreed. Every type role uses `clamp()` between
   the two given anchors, so both endpoints are exact and nothing jumps in between.
2. **Flow layout instead of absolute positioning.** Figma positions everything
   absolutely at 1440. Only the hero artwork keeps absolute placement, because its
   crop is part of the composition.
3. **Fonts are self-hosted** via `@fontsource` rather than the Google Fonts CDN.
   Embedding the CDN ships visitor IPs to Google, which is a live GDPR problem for a
   German organisation. Same files, same rendering.
4. **`min-height` rather than fixed heights** on cards and sections, and
   `min-width` on buttons. German runs longer than English and the copy is editable.
   The Controls frame asks for exactly this ("Für längere Labels die CTA-Zeile
   umbrechen bzw. stapeln, nicht den Text abschneiden").
5. **Theme cards use `auto-fit`**, not a hard 3 columns, so a fourth mission
   (Next.Research) does not need a layout rewrite.
6. **The exported SVGs had `preserveAspectRatio="none"` stripped.** Figma adds it
   because it places artwork at exact pixel sizes, but it forces non-uniform scaling
   from inside the file, which overrides `object-fit` and mask sizing alike. With it
   gone the hero artwork scales uniformly and crops instead of stretching. The flat
   hero background layer was a single solid rect, so it is a background colour now
   (`--ns-surface-hero`) rather than an image.
7. **`target="_blank"` only for genuinely external links.** The Figma frame marks
   every link external, including same-site navigation.
8. **The design's unlinked "Explore" nav item is named "Compendium"**, after where it
   goes: the wiki-rendered Compendium on this site. Confirm the intended target.
9. **Only the home page uses `--ns-surface-light`.** Everywhere else the warm paper
   tone runs behind the content: the near-white ground read as a white slab behind
   every page. On the home page the pale band is the Figma composition, playing
   against the dark Idea section above it.

## Open items, from the library's own annotations

- Target URLs and routing are unconfirmed. Everything outbound sits in
  `src/content/links.ts`; site links currently point at the pages live today on
  `nextsociety.ieb.net`.
- Hover, focus and disabled are **proposals**, not approved. Implemented as drawn:
  focus is a 2px ring at 2px offset.
- Intermediate widths, sticky behaviour and further states still to be agreed.
- Education, Democracy and Economy key visuals are WIP and centrally swappable:
  replace `public/assets/card-*.jpg`, nothing else.
- The library is local and unpublished in Figma.

## Known issue to decide

On mobile the headline sits directly over the artwork, and over the lighter paper
tones the contrast drops below WCAG AA. The design does this too, so it has been
built as drawn rather than silently altered. Options: darken the mobile cut, move
the type, or add a scrim. Needs an art-direction call.

## Wiki-rendered pages

The site renders the Outline wiki. 37 pages build from 5 published shares: a home
page, 5 collection indexes and 31 documents.

```bash
npm run fetch:wiki    # refresh src/data/wiki.json and mirror images
npm run build         # runs fetch:wiki first, then astro build
```

### How it works

`scripts/fetch-wiki.mjs` reads the wiki and writes `src/data/wiki.json`, then the
pages are a pure function of (`wiki.config.mjs` + `wiki.json`). Three reasons for a
prebuild step rather than fetching in the components:

1. Builds are reproducible and work offline once the data is there.
2. `wiki.json` is committed, so a wiki edit shows up in review as the prose that
   will actually ship. The diff is the review artefact.
3. **Outline image URLs are presigned S3 links that expire.** Anything referencing
   them at runtime would 403 within days, so they are mirrored into
   `public/assets/wiki/` and the markdown is rewritten.

**No API token is needed.** `shares.info` and `documents.info` both accept
unauthenticated reads for published shares, so this runs in CI without production
credentials.

### What the site points at

`src/content/wiki.config.mjs` is the only place that declares what gets rendered.
Pointers are share slugs, never UUIDs, so the config reviews readably. A missing
`required` pointer fails the build; Next.Research is marked optional because its
share does not exist yet.

### The publish gate

Every wiki page carries a header table (`| Owner: | Status: Garden | Reviewed: |`).
Status is the wiki's own Jungle / Garden / Park convention. `hideStatus` currently
hides **Jungle**, and `skipTitles` hides Tasks and Meetings. That removed 17 of 48
documents in the current build.

Worth being clear about what this gate is: these are **published shares**, already
readable by anyone at next.ieb.net without a login, so mirroring them leaks nothing
new. The gate is editorial, not a security boundary. It keeps the wild pages off the
website, not off the internet.

### What the fetch does to the markdown

- Parses and strips the owner header table (Outline has no typed fields, so that
  table is the metadata convention).
- Rewrites cross-links. The wiki writes them both relative and absolute, and both
  are internalised when they point at a page this site renders. Links to gated-out
  or unrendered pages fall back to the wiki, never to a 404.
- Mirrors images and rewrites their URLs.
- Strips Outline user mentions down to plain names.
- **Fails the build on any broken internal link.** A wiki edit that un-publishes a
  linked page would otherwise ship a silent 404, which is the failure this design
  exists to prevent.

### Page design

The library has no design for wiki pages, so these are composed from the existing
roles: mono eyebrow, Inter title, body prose, brand surface on the page head. The
`.ns-prose` block styles by element with no class hooks, so an editor writing
something unanticipated gets a plainer page rather than a broken one.

A collection index reads as a table of contents: titles aligned, depth carrying the
structure, status quietly to the right. Opening a document keeps that list beside it
(`CollectionNav`) as a sticky column from `lg` up and a collapsed disclosure below,
so a reader can move through the Compendium without going back to the index. Both
presentations are the same list and neither needs JavaScript.

On a document page the title sits **inside the content column**, not in a band above
both columns, so the contents list starts level with it. The sticky offset is set to
the column's own resting offset (header height plus the main element's top padding),
which means the list is already exactly where it will pin and never snaps into place.

The sidebar carries no heading of its own: the collection's overview document is the
first entry, so a title there printed the same word twice.

### One structural normalisation

The Compendium is shaped `Compendium (collection) > Compendium (document) > Part 1,
Part 2, ...`, so without help every page reads as Compendium inside Compendium and the
parts sit a level deeper than they are. Every other collection puts its documents at
the root. `liftSingleRoot` in the fetch script levels the odd one out: the wrapper
stays as the collection's opening document and its children come up beside it, giving
Compendium / Part 1: Leitmotif / Part 2: Missions / Part 3: Playbooks / References.

It is presentation only and **self-disabling**: the rule needs a collection with
exactly one root document that has children. Fix the shape in Outline (move the parts
to the collection root) and the rule stops applying with no code change.

Each page shows its status and reviewed date and links back to the wiki to edit or
discuss, which is honest about a living document and keeps the editing loop in the
wiki where it belongs.

## Ported pages

The six pages the old static site had, rebuilt in the 3.5 style:

| Route | Built from | Notes |
|---|---|---|
| `/philosophy` `/mission` `/playbook` | the old dimension pages | Numbered manifesto eyebrow, lead, CTA row, ported prose, then a link into the matching Compendium part |
| `/about` | `about.html` | |
| `/press` | `press.html` | Key facts as a divided list; logo and press kit as downloads |
| `/imprint` | `imprint.html` | German legal text reproduced **verbatim**, in a `lang="de"` block, with no take-part CTA |

Copy lives in `src/content/pages.ts`. Nav and footer now point at these internal
routes instead of the old live `.html` pages.

### Two content problems carried over, not introduced

1. **Naming.** The old About and Press copy calls the whole project "The Next
   Economy". The 3.5 design renames the whole to "Next. Society" and makes
   Next.Economy one of three missions beside Education and Democracy. The ported
   text is the original, so those pages currently describe the project under its
   previous name. This is next.infra issue #41. It is a copy decision, so the strings
   are left as written: fix them in `pages.ts` once the wording is settled.
2. **The press contact is still a placeholder** — "[Confirm name], [confirm email]".
   That is live on the old site today. Carried over rather than invented.

## What is not here yet

- **German.** The old site has a full `/de/` mirror; none of it is ported, and the
  EN/DE switch still points at the old site's German pages. The wiki-bot `translate`
  job would feed a real German build; see the notes.
- The theme cards on the home page still link to the wiki, as designed, rather than
  to the rendered pages. "Explore" in the nav opens `/compendium`.
- Search, and any listing of what changed recently.
