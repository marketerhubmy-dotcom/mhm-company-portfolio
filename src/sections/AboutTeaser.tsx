import { ArrowUpRight } from 'lucide-react';
import { ButtonLink } from '@/components/Button';
import { SectionLabel } from '@/components/SectionLabel';
import { site } from '@/config/site';

export const studioFacts = [
  ['Fokus', 'Founder, SME & bisnes online di Malaysia'],
  ['Bahasa', 'Bahasa Melayu & English'],
  ['Pendekatan', 'Masalah dahulu, prototaip awal, bina berfasa'],
  ['Ekosistem', 'MHM Academy — modul digital'],
] as const;

export function AboutTeaser() {
  return (
    <section className="section-y" aria-labelledby="about-title">
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7" data-reveal>
          <SectionLabel n="07">Tentang MHM Center</SectionLabel>
          <h2 id="about-title" className="display-l mt-6 max-w-[14ch]">
            Kami bermula dengan masalah bisnes, <span className="serif-accent text-brand-deep">bukan template.</span>
          </h2>
        </div>
        <div className="lg:col-span-5 lg:pt-16" data-reveal style={{ ['--d' as string]: 1 }}>
          <p className="lede text-ink-soft">
            MHM Center ialah studio penyelesaian digital yang membina laman web, sistem bisnes dan automasi untuk founder serta bisnes yang sedang berkembang di Malaysia.
          </p>
          <dl className="mt-8 divide-y divide-line border-y border-line">
            {studioFacts.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[7.5rem_1fr] gap-4 py-3.5 text-[0.95rem]">
                <dt className="label pt-1 text-muted">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <ButtonLink to="/tentang" variant="outline">Kenali Kami</ButtonLink>
            <a href={site.academyUrl} target="_blank" rel="noopener noreferrer" className="link-underline inline-flex items-center gap-1.5 text-[0.95rem]">
              MHM Academy <ArrowUpRight className="size-4" aria-hidden="true" />
              <span className="sr-only">(dibuka dalam tab baharu)</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
