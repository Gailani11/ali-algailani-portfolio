# Ali Algailani — Portfolio website

A cinematic, bilingual (EN / AR) portfolio website built from **Ali Algailani Portfolio 2026.pdf**.
Every project, caption, palette, page count and contact detail comes from the PDF (`src/data/content.ts`),
and every image is extracted from its pages (`public/assets`, 152 WebP files, ~8 MB).

## Run it

```bash
bun run build.ts           # production build → dist/
bun run build.ts --serve   # build + local preview on http://localhost:4173
tsc -p .                   # type-check
```

`dist/` is fully static with relative paths: upload it to Vercel, Netlify, GitHub Pages, S3 or any folder.

## Stack

- **React 19 + TypeScript**, bundled and minified by **Bun** (one JS file, one CSS file).
- **Custom motion engine, no runtime dependencies** (`src/lib`):
  - `tone.ts` — reads whether the page under a point is light or dark; the cursor and the
    glass header use it to switch ink/paper colours smoothly.
  - `scroll.ts` — Lenis-style smooth scrolling on native document scroll, one shared rAF loop.
  - `hooks/useScene.ts` — ScrollTrigger-style scroll scenes (progress 0 → 1 between two scroll positions).
  - `reveal.ts` — one shared IntersectionObserver for every `data-rv` reveal.
  - `router.tsx` — hash router + curtain page transitions (`#work`, `#id-gift-zone`, `#logos` …).
  - FLIP layout animation for the work filter (Web Animations API) in `pages/WorkArchive.tsx`.
- Hand-written CSS with design tokens (`src/styles/tokens.css`): Poppins + IBM Plex Sans Arabic (Google Fonts).

> Why not GSAP / Lenis / Framer Motion / Tailwind / Next.js? The workspace this was built in had no
> access to the npm registry or CDNs, so only React, TypeScript and Bun were available. The motion
> system above covers the same ground in ~600 lines with zero dependencies. If you want Next.js later,
> the components move over unchanged: make `Home`, `WorkArchive` and `ProjectDetail` route pages and
> replace `RLink` with `next/link`. Install `@types/react` and delete `src/types/react-shim.d.ts`.

## Languages

Arabic is the default; the header switch (ع / EN) swaps the whole interface behind the
page-transition curtain and keeps the reader in place. Interface copy lives in
`src/lib/i18n.tsx`; Arabic versions of project descriptions sit beside the English ones in
`src/data/content.ts` (`descriptionAr`, `sectorAr`, …). Inside `<main>` the layout mirrors to
RTL; the fixed chrome keeps the book's physical layout.

## Structure

```
src/
  data/content.ts        all portfolio content (from the PDF)
  data/assets.ts         generated image dimensions + tile lists
  lib/                   scroll engine, router/transitions, reveal, env helpers
  hooks/useScene.ts      scroll scenes
  components/            Navigation, Cursor, Chrome (folio + chapter rail), Loader, Lightbox,
                         SectionHeader, ImageReveal, MagneticButton, Phone, Img, Text
  sections/              Hero, About, Contents, Logos, Identities, UIUX, Profiles, Print, Social, Finale
  pages/                 Home, WorkArchive, ProjectDetail
  styles/                tokens, base, chrome, home, chapters, pages
public/
  assets/                images extracted from the PDF
  Ali-Algailani-Portfolio-2026.pdf   web-optimised copy of the PDF (13 MB) for the download button
```

## Updating content

- Text: edit `src/data/content.ts`.
- Images: re-run the extraction pipeline (`extract.py`, Pillow + NumPy) against a new PDF, or drop
  WebP files into `public/assets/…` and add their dimensions to `src/data/assets.ts`.
- To ship the full-quality PDF instead of the optimised copy, replace
  `public/Ali-Algailani-Portfolio-2026.pdf` with the original file.

## Accessibility & performance

Semantic landmarks, skip link, visible focus, keyboard-operable menu (focus trap, Escape), lightbox
(arrows, Escape), phone and filters. `prefers-reduced-motion` turns off smooth scroll, reveals and
scrubbed effects. Images are lazy-loaded with intrinsic sizes (no layout shift); animations use
transforms / clip-path only; the custom cursor is disabled on touch devices.

## Note on assets in this package

To keep the download small, the images and the PDF are included once, inside `../website/`.
Before building from source, copy them back:

```bash
cp -r ../website/assets public/assets
cp ../website/Ali-Algailani-Portfolio-2026.pdf public/
```
