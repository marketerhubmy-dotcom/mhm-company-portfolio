import { Link } from 'react-router';
import { ArrowUpRight } from 'lucide-react';
import { SectionLabel } from '@/components/SectionLabel';
import { ButtonLink } from '@/components/Button';
import { formatPriceRange, services } from '@/data/services';

export function ServicesIndex() {
  return (
    <section className="section-y relative overflow-hidden bg-ink text-paper" aria-labelledby="svc-title">
      <div className="guides-dark absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="container-x relative">
        <div className="grid gap-8 md:grid-cols-12 md:items-end" data-reveal>
          <div className="md:col-span-8">
            <SectionLabel n="04" dark>Servis</SectionLabel>
            <h2 id="svc-title" className="display-l mt-6">
              Lapan cara kami <span className="serif-accent text-brand-bright">membantu.</span>
            </h2>
          </div>
          <p className="text-paper/70 md:col-span-4 md:pb-2">Pilih titik permulaan anda. Banyak projek bermula dengan satu servis dan berkembang menjadi sistem yang lebih lengkap.</p>
        </div>
        <ul className="mt-14 border-t border-line-dark">
          {services.map((s, i) => (
            <li key={s.id} data-reveal style={{ ['--d' as string]: i % 4 }}>
              <Link to={`/servis#${s.id}`} className="group relative grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 overflow-hidden border-b border-line-dark py-6 md:grid-cols-[4rem_1.1fr_1fr_auto] md:gap-8 md:py-8">
                <span aria-hidden="true" className="absolute inset-0 -z-0 origin-left scale-x-0 bg-paper/[0.04] transition-transform duration-700 ease-out-expo group-hover:scale-x-100" />
                <span className="label relative text-muted-dark">{String(i + 1).padStart(2, '0')}</span>
                <span className="relative font-display text-[clamp(1.4rem,1.1rem+1.3vw,2.3rem)] font-semibold leading-none tracking-[-0.03em] transition-transform duration-700 ease-out-expo group-hover:translate-x-2">
                  {s.title}
                  {s.priceRange && <span className="label mt-2 block font-sans !tracking-[0.08em] text-brand-bright md:hidden">Anggaran {formatPriceRange(s.priceRange)}</span>}
                </span>
                <span className="relative hidden md:block">
                  <span className="block text-paper/65">{s.short}</span>
                  {s.priceRange && <span className="label mt-2 block text-brand-bright">Anggaran {formatPriceRange(s.priceRange)}</span>}
                </span>
                <span aria-hidden="true" className="relative grid size-10 place-items-center rounded-full border border-line-dark transition-[background-color,color,transform] duration-500 ease-out-expo group-hover:rotate-45 group-hover:bg-brand group-hover:text-paper">
                  <ArrowUpRight className="size-4" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-12" data-reveal>
          <ButtonLink to="/servis" variant="light">Butiran Servis</ButtonLink>
        </div>
      </div>
    </section>
  );
}
