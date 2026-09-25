/**
 * Production build (Bun): bundles and minifies src/ into dist/app, copies public/,
 * and writes dist/index.html with hashed asset links. Output is fully static and
 * uses relative paths, so it deploys to any host or sub-folder unchanged.
 *
 *   bun run build.ts          → dist/
 *   bun run build.ts --serve  → dist/ + a local static server on :4173
 */
import { rmSync, mkdirSync, cpSync, readFileSync, writeFileSync } from 'node:fs';
import { basename } from 'node:path';

const OUT = 'dist';
rmSync(OUT, { recursive: true, force: true });
mkdirSync(`${OUT}/app`, { recursive: true });

const result = await Bun.build({
  entrypoints: ['src/main.tsx'],
  outdir: `${OUT}/app`,
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

cpSync('public', OUT, { recursive: true });

const html = readFileSync('index.html', 'utf8')
  .replace('<!--STYLES-->', css.map((h) => `<link rel="stylesheet" href="${h}" />`).join('\n    '))
  .replace('<!--SCRIPTS-->', js.map((s) => `<script defer src="${s}"></script>`).join('\n    '));
writeFileSync(`${OUT}/index.html`, html);

for (const o of result.outputs) console.log(`${basename(o.path).padEnd(34)} ${(o.size / 1024).toFixed(1)} kB`);

if (process.argv.includes('--serve')) {
  const port = 4173;
  Bun.serve({
    port,
    async fetch(req) {
      const p = new URL(req.url).pathname;
      const f = Bun.file(`${OUT}${p === '/' ? '/index.html' : decodeURIComponent(p)}`);
      return (await f.exists()) ? new Response(f) : new Response('Not found', { status: 404 });
    },
  });
  console.log(`serving ${OUT}/ on http://localhost:${port}`);
}
