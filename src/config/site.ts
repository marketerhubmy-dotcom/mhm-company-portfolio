/**
 * Public site configuration. Values come from build-time env vars
 * (see .env.example) so contact details are never hard-coded or invented.
 */
const env = import.meta.env;

const digits = (v?: string) => (v ?? '').replace(/\D/g, '');
const email = (v?: string) => (v && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? v.trim() : '');

export const site = {
  name: 'MHM CENTER',
  shortName: 'MHM Center',
  tagline: 'Studio Penyelesaian Digital & Pembangunan Teknologi',
  description:
    'MHM Center mereka dan membina landing page, website bisnes, e-commerce, web app, sistem CRM/ERP, SaaS dan automasi AI untuk founder dan bisnes di Malaysia.',
  url: (env.VITE_SITE_URL || 'https://web.mhmacademy.site').replace(/\/+$/, ''),
  locale: 'ms_MY',
  lang: 'ms',
  whatsappNumber: digits(env.VITE_WHATSAPP_NUMBER),
  email: email(env.VITE_CONTACT_EMAIL),
  location: 'Malaysia',
  academyUrl: env.VITE_ACADEMY_URL || 'https://mhmacademy.site',
  githubOwner: 'marketerhubmy-dotcom',
} as const;

export const hasWhatsApp = site.whatsappNumber.length >= 9;

export function whatsappLink(message: string): string | null {
  if (!hasWhatsApp) return null;
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const nav = [
  { to: '/kerja', label: 'Hasil Kerja' },
  { to: '/servis', label: 'Servis' },
  { to: '/tentang', label: 'Tentang' },
  { to: '/hubungi', label: 'Hubungi' },
] as const;
