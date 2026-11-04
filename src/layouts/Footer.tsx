import { Link } from 'react-router';
import { ArrowUpRight } from 'lucide-react';
import { nav, site } from '@/config/site';
import { services } from '@/data/services';
import { LogoFull } from '@/components/Logo';

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink text-paper">
      <div className="guides-dark absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="container-x relative pt-20">
        <div className="grid gap-12 border-b border-line-dark pb-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <LogoFull onDark className="w-44" />
            <p className="mt-6 max-w-sm text-[1.05rem] leading-relaxed text-paper/75">
              {site.tagline}. Kami membina sistem digital yang digunakan setiap hari oleh bisnes di Malaysia.
            </p>
          </div>
          <FooterCol title="Navigasi" className="md:col-span-2">
            {[{ to: '/', label: 'Utama' }, ...nav].map((n) => (
              <li key={n.to}><Link to={n.to} viewTransition className="link-underline text-paper/80 hover:text-paper">{n.label}</Link></li>
            ))}
          </FooterCol>
          <FooterCol title="Servis" className="md:col-span-3">
            {services.slice(0, 6).map((s) => (
              <li key={s.id}><Link to={`/servis#${s.id}`} className="link-underline text-paper/80 hover:text-paper">{s.title}</Link></li>
            ))}
          </FooterCol>
          <FooterCol title="Ekosistem" className="md:col-span-2">
            <li>
              <a href={site.academyUrl} target="_blank" rel="noopener noreferrer" className="link-underline inline-flex items-center gap-1 text-paper/80 hover:text-paper">
                MHM Academy <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </a>
            </li>
            {site.email && <li><a href={`mailto:${site.email}`} className="link-underline break-words text-paper/80 hover:text-paper">{site.email.split('@')[0]}@<wbr />{site.email.split('@')[1]}</a></li>}
            <li className="text-paper/60">{site.location}</li>
          </FooterCol>
        </div>

        <svg aria-hidden="true" viewBox="0 0 1000 128" className="mt-10 block w-full select-none fill-paper/[0.07]">
          <text x="0" y="118" textLength="1000" lengthAdjust="spacingAndGlyphs" className="font-display" style={{ fontSize: 150, fontWeight: 680, letterSpacing: '-0.05em' }}>
            MHM CENTER
          </text>
        </svg>
        <div className="flex flex-col gap-2 border-t border-line-dark py-6 text-sm text-paper/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {__BUILD_YEAR__} {site.name}. Hak cipta terpelihara.</p>
          <p className="label">Dibina di Malaysia · React · Cloudflare Pages</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, className, children }: { title: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={className}>
      <p className="label mb-5 text-muted-dark">{title}</p>
      <ul className="space-y-3 text-[0.95rem]">{children}</ul>
    </div>
  );
}
