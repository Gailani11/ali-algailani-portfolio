# Ali Al Gailani — Portfolio 2026

The portfolio website of **Ali Al Gailani, Senior Graphic & UI/UX Designer**: a cinematic,
bilingual (Arabic / English) site built from *Ali Algailani Portfolio 2026.pdf*.
Every project, caption, palette, page count and contact detail comes from the PDF
(`src/data/content.ts`), and every image is taken from its pages (`public/assets`).

This folder is the complete project. It has no dependency on any other folder or on any
previous deployment: the images, the downloadable PDF and the build script are all here.

## Project structure

```
portfolio/
├── src/                      application (React 19 + TypeScript)
│   ├── main.tsx, App.tsx
│   ├── data/content.ts       all portfolio content (from the PDF)
│   ├── data/assets.ts        image sizes, keyed by asset path
│   ├── lib/                  scroll engine, router + page transitions, i18n, reveals
│   ├── hooks/, components/, sections/, pages/
│   └── styles/               design tokens and CSS
├── public/                   copied as-is into dist/ by the build
│   ├── assets/               154 portfolio images (WebP)
│   │   ├── cp/               company profiles
│   │   ├── id/               visual identities
│   │   ├── logos/            logos
│   │   ├── misc/             QR code
│   │   ├── pr/               print
│   │   ├── sm/               social media
│   │   └── ui/               UI/UX (Fully Charged, Trackulizer)
│   ├── Ali-Algailani-Portfolio-2026.pdf   the "Download portfolio" file (20 MB)
│   ├── favicon.svg
│   └── og.jpg                social-share image
├── tools/                    one-off image pipeline (not used by the build)
├── build.ts                  production build (Bun)
├── index.html                page template (SEO, Open Graph, fonts)
├── package.json
├── tsconfig.json
├── vercel.json               Vercel settings (install, build, output)
└── README.md
```

## Live site

The Vercel project `ali-algailani-portfolio-2026` is connected to this repository:
every push to `main` builds and publishes **https://alialgailani.com** automatically
(also reachable at www.alialgailani.com and https://ali-algailani-portfolio-2026.vercel.app).
No zip uploads are needed any more. Only the web records point at Vercel; the domain's
email (info@alialgailani.com) is unaffected.

## Deploy as a new Vercel project

`vercel.json` already tells Vercel how to install, build and publish, so no settings
need to be typed in.

**Option A — GitHub (recommended)**

1. Create a new, empty repository on GitHub.
2. Put the **contents of this `portfolio` folder** at the root of the repository
   (so `package.json` and `vercel.json` sit at the top level) and push.
   GitHub Desktop or `git` is easiest; the GitHub web uploader takes at most 100 files per
   upload, so with it, upload `public/assets` in a second commit.
   ```bash
   cd portfolio
   git init && git add . && git commit -m "Portfolio 2026"
   git branch -M main
   git remote add origin https://github.com/<you>/<repo>.git
   git push -u origin main
   ```
3. In Vercel: **Add New… → Project → Import** that repository.
4. Leave everything as detected and press **Deploy**.

**Option B — Vercel CLI (no GitHub)**

```bash
cd portfolio
npx vercel          # first time: log in, accept the defaults
npx vercel --prod   # publish to the production URL
```

**Settings Vercel will use** (from `vercel.json`; nothing to change in the dashboard):

| Setting          | Value            |
| ---------------- | ---------------- |
| Framework Preset | Other            |
| Root Directory   | `./` (leave empty) |
| Install Command  | `bun install`    |
| Build Command    | `bun run build`  |
| Output Directory | `dist`           |

The site uses hash links (`#work`, `#id-gift-zone`, …), so no rewrites are needed.

## Run it locally

Requires [Bun](https://bun.sh) 1.1 or newer.

```bash
bun install
bun run build        # → dist/
bun run preview      # build + serve on http://localhost:4173
bun run typecheck    # TypeScript check
```

`dist/index.html` also opens directly from disk (no server needed).

The build stops with an error if any of `public/assets/{cp,id,logos,misc,pr,sm,ui}` or the
PDF is missing, so a deployment can never go live without its images.

## Build output

```
dist/
├── app/                      main-<hash>.js, main-<hash>.css
├── assets/                   cp/ id/ logos/ misc/ pr/ sm/ ui/
├── Ali-Algailani-Portfolio-2026.pdf
├── favicon.svg
├── og.jpg
└── index.html
```

## Stack

- **React 19 + TypeScript**, bundled and minified by **Bun** into one JS and one CSS file.
- **Custom motion system, no runtime dependencies** (`src/lib`): Lenis-style smooth
  scrolling (`scroll.ts`), ScrollTrigger-style scenes (`hooks/useScene.ts`), one shared
  IntersectionObserver for reveals (`reveal.ts`), a hash router with curtain page
  transitions (`router.tsx`), FLIP filtering on the Work page, and `tone.ts`, which lets the
  cursor and the glass header switch between ink and paper over light and dark sections.
- Hand-written CSS with design tokens (`src/styles/tokens.css`); Poppins and IBM Plex Sans
  Arabic from Google Fonts.

## Languages

Arabic is the default; the header switch (ع / EN) swaps the interface behind the
page-transition curtain and keeps the reader in place. Interface copy is in
`src/lib/i18n.tsx`; Arabic versions of project texts sit beside the English ones in
`src/data/content.ts` (`descriptionAr`, `sectorAr`, …). Inside `<main>` the layout mirrors to
right-to-left; the fixed frame (header, folio, chapter rail) keeps the book's layout.

## Updating content

- **Text:** edit `src/data/content.ts`.
- **Images:** add or replace WebP files in `public/assets/…` and put their width and
  height in `src/data/assets.ts` under the same key (the path without `.webp`).
- **The PDF:** replace `public/Ali-Algailani-Portfolio-2026.pdf` (keep the file name).

## Tools (optional)

`tools/` holds the scripts that cut the images out of the PDF. They are not part of the
build and need Python 3 with Pillow, NumPy and SciPy, plus poppler (`pdftoppm`, `pdfimages`).

- `extract.py`, `xycut.py`, `recrop.py` — logos, identities, profiles, print and social
  images. They read 300 dpi page renders from `tools/pages/pNN.jpg`
  (`pdftoppm -r 300 -jpeg portfolio.pdf tools/pages/p`, renamed to two-digit page numbers).
- `ui_screens.py` — the 24 app screens, cut square to each screen at iPhone proportions:
  `python3 tools/ui_screens.py "Ali Algailani Portfolio 2026.pdf"`.
- `make_share.py` — packs a built `dist/` into one self-contained `.html` file to send to
  someone: `python3 tools/make_share.py dist <pdf-to-embed> Ali-Algailani-Portfolio.html`.

## Accessibility & performance

Semantic landmarks, skip link, visible focus, keyboard-operable menu (focus trap, Escape),
lightbox (arrows, Escape), phone and filters. `prefers-reduced-motion` turns off smooth
scroll, reveals and scrubbed effects. Images are lazy-loaded with intrinsic sizes (no layout
shift); animations use transforms and clip-path only; the custom cursor is off on touch devices.
