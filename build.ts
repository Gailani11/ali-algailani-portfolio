/**
 * Production build (Bun): bundles and minifies src/ into dist/app, copies public/
 * (portfolio images, PDF, favicon, social image) into dist/, and writes
 * dist/index.html with hashed asset links. Everything the site needs lives inside
 * this project; the output is fully static and uses relative paths, so it deploys
 * to any host or sub-folder unchanged.
 *
 *   bun run build            → dist/
 *   bun run preview          → dist/ + a local static server on http://localhost:4173
 */
import { rmSync, mkdirSync, cpSync, existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';

const ROOT = import.meta.dir;
const OUT = join(ROOT, 'dist');
const PUBLIC = join(ROOT, 'public');
const ASSET_GROUPS = ['cp', 'id', 'logos', 'misc', 'pr', 'sm', 'ui'];
const PDF = 'Ali-Algailani-Portfolio-2026.pdf';

// refuse to build a site without its images or its PDF
for (const g of ASSET_GROUPS) {
  const dir = join(PUBLIC, 'assets', g);
  if (!existsSync(dir) || readdirSync(dir).length === 0) {
    console.error(`Missing portfolio assets: public/assets/${g}/`);
    process.exit(1);
  }
}
if (!existsSync(join(PUBLIC, PDF))) {
  console.error(`Missing public/${PDF}`);
  process.exit(1);
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(join(OUT, 'app'), { recursive: true });

const result = await Bun.build({
  entrypoints: [join(ROOT, 'src/main.tsx')],
  outdir: join(OUT, 'app'),
  target: 'browser',
  format: 'iife',
  minify: true,
  splitting: false,
  sourcemap: 'none',
  naming: '[name]-[hash].[ext]',
  define: { 'process.env.NODE_ENV': '"production"' },
});
if (!result.success) {
  for (const l of result.logs) console.error(l);
  process.exit(1);
}

const js = result.outputs.filter((o) => o.path.endsWith('.js')).map((o) => `app/${basename(o.path)}`);
const css = result.outputs.filter((o) => o.path.endsWith('.css')).map((o) => `app/${basename(o.path)}`);

// public/ → dist/ (assets/, the PDF, favicon.svg, og.jpg)
cpSync(PUBLIC, OUT, { recursive: true });

const html = readFileSync(join(ROOT, 'index.html'), 'utf8')
  .replace('<!--STYLES-->', css.map((h) => `<link rel="stylesheet" href="${h}" />`).join('\n    '))
  .replace('<!--SCRIPTS-->', js.map((s) => `<script defer src="${s}"></script>`).join('\n    '));
writeFileSync(join(OUT, 'index.html'), html);

for (const o of result.outputs) console.log(`${basename(o.path).padEnd(34)} ${(o.size / 1024).toFixed(1)} kB`);
const count = (d: string): number =>
  readdirSync(d, { withFileTypes: true }).reduce((n, e) => n + (e.isDirectory() ? count(join(d, e.name)) : 1), 0);
console.log(`dist/assets: ${count(join(OUT, 'assets'))} images in ${ASSET_GROUPS.join(', ')}`);

if (process.argv.includes('--serve')) {
  const port = 4173;
  Bun.serve({
    port,
    async fetch(req) {
      const p = new URL(req.url).pathname;
      const f = Bun.file(join(OUT, p === '/' ? 'index.html' : decodeURIComponent(p)));
      return (await f.exists()) ? new Response(f) : new Response('Not found', { status: 404 });
    },
  });
  console.log(`serving dist/ on http://localhost:${port}`);
}
