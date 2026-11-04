import { createContext, useContext, useEffect } from 'react';
import { site } from '@/config/site';

export type HeadData = {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: 'website' | 'article';
  noindex?: boolean;
  jsonLd?: Record<string, unknown>[];
};

/** During SSR the collector receives the page's head data synchronously. */
export const HeadContext = createContext<{ set: (d: HeadData) => void } | null>(null);

export const fullTitle = (t: string) => (t === site.name || t.includes(site.name) ? t : `${t} — ${site.name}`);
const abs = (p: string) => (/^https?:\/\//.test(p) ? p : `${site.url}${p.startsWith('/') ? p : `/${p}`}`);
const DEFAULT_OG = '/og/mhm-center.png';

function tags(d: HeadData) {
  const url = abs(d.path === '/' ? '/' : d.path);
  const image = abs(d.image ?? DEFAULT_OG);
  return {
    title: fullTitle(d.title),
    meta: [
      ['name', 'description', d.description],
      ['name', 'robots', d.noindex ? 'noindex, follow' : 'index, follow'],
      ['property', 'og:type', d.type ?? 'website'],
      ['property', 'og:site_name', site.name],
      ['property', 'og:locale', site.locale],
      ['property', 'og:title', fullTitle(d.title)],
      ['property', 'og:description', d.description],
      ['property', 'og:url', url],
      ['property', 'og:image', image],
      ['name', 'twitter:card', 'summary_large_image'],
      ['name', 'twitter:title', fullTitle(d.title)],
      ['name', 'twitter:description', d.description],
      ['name', 'twitter:image', image],
    ] as const,
    canonical: url,
    jsonLd: d.jsonLd ?? [],
  };
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
/** JSON inside <script> must not be able to close the tag. */
const safeJson = (o: unknown) => JSON.stringify(o).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');

export function renderHeadToString(d: HeadData): string {
  const t = tags(d);
  return [
    `<title>${esc(t.title)}</title>`,
    ...t.meta.map(([attr, key, val]) => `<meta ${attr}="${key}" content="${esc(val)}" data-h>`),
    `<link rel="canonical" href="${esc(t.canonical)}" data-h>`,
    ...t.jsonLd.map((j) => `<script type="application/ld+json" data-h>${safeJson(j)}</script>`),
  ].join('\n    ');
}

function applyHead(d: HeadData) {
  const t = tags(d);
  document.title = t.title;
  for (const [attr, key, val] of t.meta) {
    let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, key);
      el.setAttribute('data-h', '');
      document.head.appendChild(el);
    }
    el.content = val;
  }
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }
  link.href = t.canonical;
  document.head.querySelectorAll('script[type="application/ld+json"][data-h]').forEach((s) => s.remove());
  for (const j of t.jsonLd) {
    const s = document.createElement('script');
    s.type = 'application/ld+json';
    s.setAttribute('data-h', '');
    s.textContent = JSON.stringify(j);
    document.head.appendChild(s);
  }
}

export function Seo(props: HeadData) {
  const ctx = useContext(HeadContext);
  if (ctx) ctx.set(props);
  const key = JSON.stringify(props);
  useEffect(() => {
    applyHead(JSON.parse(key) as HeadData);
  }, [key]);
  return null;
}

export const organizationLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: site.name,
  url: site.url,
  description: site.description,
  areaServed: 'MY',
  ...(site.email ? { email: site.email } : {}),
});
