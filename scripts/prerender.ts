/**
 * Static prerender: renders every route to HTML so pages (including each
 * project case study) are crawlable without JavaScript, then writes
 * sitemap.xml, robots.txt and Cloudflare Pages _headers (with a CSP hash
 * for the single inline script).
 */
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = resolve(import.meta.dirname, '..');
const DIST = join(ROOT, 'dist');
const SSR = join(ROOT, 'dist-ssr', 'entry-server.js');

type Mod = {
  render: (url: string) => { html: string; head: string; noindex: boolean };
  projects: { slug: string; updatedAt: string }[];
  site: { url: string };
};

const mod = (await import(pathToFileURL(SSR).href)) as Mod;
const template = readFileSync(join(DIST, 'index.html'), 'utf8');
if (!template.includes('<!--app-head-->') || !template.includes('<!--app-html-->')) throw new Error('Template placeholders hilang');

const staticRoutes = ['/', '/kerja', '/servis', '/tentang', '/hubungi'];
const projectRoutes = mod.projects.map((p) => `/kerja/${p.slug}`);
const routes = [...staticRoutes, ...projectRoutes];

/** "/kerja" → dist/kerja.html (Cloudflare Pages serves it at /kerja without a trailing slash). */
const outFile = (route: string) => (route === '/' ? join(DIST, 'index.html') : join(DIST, `${route.slice(1)}.html`));

function page(route: string) {
  const { html, head } = mod.render(route);
  return template.replace('<!--app-head-->', head).replace('<!--app-html-->', html);
}

let count = 0;
for (const route of routes) {
  const file = outFile(route);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, page(route));
  count++;
}
writeFileSync(join(DIST, '404.html'), page('/__404__'));

// sitemap.xml + robots.txt
const lastmod = (route: string) => mod.projects.find((p) => route === `/kerja/${p.slug}`)?.updatedAt;
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map((r) => `  <url><loc>${mod.site.url}${r === '/' ? '/' : r}</loc>${lastmod(r) ? `<lastmod>${lastmod(r)}</lastmod>` : ''}</url>`)
  .join('\n')}
</urlset>
`;
writeFileSync(join(DIST, 'sitemap.xml'), sitemap);
writeFileSync(join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${mod.site.url}/sitemap.xml\n`);

// Security headers with a hash for the one inline script in the template.
const inline = [...template.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]!);
const hashes = inline.map((s) => `'sha256-${createHash('sha256').update(s).digest('base64')}'`).join(' ');
const csp = [
  "default-src 'self'",
  `script-src 'self' ${hashes}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://raw.githubusercontent.com",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  'upgrade-insecure-requests',
].join('; ');
const headers = `/*
  Content-Security-Policy: ${csp}
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
  X-Frame-Options: DENY
  Cross-Origin-Opener-Policy: same-origin

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/projects/*
  Cache-Control: public, max-age=604800, stale-while-revalidate=86400

/og/*
  Cache-Control: public, max-age=604800
`;
writeFileSync(join(DIST, '_headers'), headers);

if (existsSync(join(ROOT, 'dist-ssr'))) rmSync(join(ROOT, 'dist-ssr'), { recursive: true, force: true });
console.log(`✓ Prerender: ${count} halaman + 404, sitemap.xml, robots.txt, _headers`);
