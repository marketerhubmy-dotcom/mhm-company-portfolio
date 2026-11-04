import { useRef } from 'react';
import { Link } from 'react-router';
import { ButtonLink } from '@/components/Button';
import { services } from '@/data/services';
import { SystemFlow } from './SystemFlow';

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType !== 'mouse') return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  return (
    <section ref={ref} onPointerMove={onMove} className="spotlight paper-grain relative overflow-hidden pt-[calc(var(--header-h)+2.5rem)] md:pt-[calc(var(--header-h)+4rem)]" aria-labelledby="hero-title">
      <div className="guides pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
      <div className="container-x relative z-10">
        <div className="enter label flex flex-wrap items-center gap-x-4 gap-y-2 text-muted" style={{ ['--i' as string]: -3 }}>
          <span className="text-ink">MHM CENTER</span>
          <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
          <span>Studio Penyelesaian Digital & Pembangunan Teknologi · Malaysia</span>
        </div>

        <h1 id="hero-title" className="display-xl mt-8 lg:mt-10">
          <span className="line-mask"><span style={{ ['--i' as string]: 0 }}>Idea bisnes anda.</span></span>
          <span className="line-mask"><span style={{ ['--i' as string]: 1 }}>Kami jadikan sistem</span></span>
          <span className="line-mask">
            <span style={{ ['--i' as string]: 2 }}>
              yang <span className="serif-accent text-brand-deep">berfungsi.</span>
            </span>
          </span>
        </h1>

        <div className="mt-10 grid gap-12 md:mt-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6">
            <p className="enter lede max-w-[36rem] text-ink-soft" style={{ ['--i' as string]: 1 }}>
              Daripada landing page yang menjual kepada sistem order, ERP dan automasi AI — kami reka dan bina penyelesaian digital yang
              ikut cara bisnes anda sebenarnya beroperasi.
            </p>
            <div className="enter mt-9 flex flex-col gap-3 xs:flex-row" style={{ ['--i' as string]: 2 }}>
              <ButtonLink to="/kerja">Lihat Hasil Kerja</ButtonLink>
              <ButtonLink to="/hubungi" variant="outline">Bincang Projek Anda</ButtonLink>
            </div>
          </div>
          <div className="enter lg:col-span-5 lg:col-start-8 lg:-mt-6" style={{ ['--i' as string]: 3 }}>
            <SystemFlow />
          </div>
        </div>

        <nav aria-label="Servis" className="enter mt-16 border-t border-line md:mt-24" style={{ ['--i' as string]: 4 }}>
          <ul className="no-scrollbar -mx-[var(--gutter)] flex overflow-x-auto px-[var(--gutter)] md:mx-0 md:grid md:grid-cols-4 md:overflow-visible md:px-0 xl:grid-cols-8">
            {services.map((s, i) => (
              <li key={s.id} className="shrink-0 border-r border-line last:border-r-0 md:border-b md:[&:nth-child(4n)]:border-r-0 xl:border-b-0 xl:[&:nth-child(4n)]:border-r">
                <Link to={`/servis#${s.id}`} className="group flex h-full min-w-[10.5rem] flex-col gap-3 px-4 py-5 transition-colors hover:bg-paper-2 md:min-w-0">
                  <span className="label text-muted transition-colors group-hover:text-brand-deep">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-[0.92rem] font-medium leading-snug">{s.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
