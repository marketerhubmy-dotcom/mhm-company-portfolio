import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { SectionLabel } from '@/components/SectionLabel';
import { problems } from '@/data/content';

export function Problems() {
  return (
    <section className="section-y" aria-labelledby="prob-title">
      <div className="container-x">
        <div className="max-w-4xl" data-reveal>
          <SectionLabel n="03">Masalah & penyelesaian</SectionLabel>
          <h2 id="prob-title" className="display-l mt-6">
            Kami tak jual teknologi. Kami selesaikan <span className="serif-accent text-brand-deep">masalah.</span>
          </h2>
        </div>
        <div className="mt-14 hidden grid-cols-12 gap-8 border-b border-ink pb-3 md:grid" aria-hidden="true">
          <span className="label col-span-5 text-muted">Masalah biasa</span>
          <span className="label col-span-6 col-start-7 text-muted">Apa yang kami bina</span>
        </div>
        <ul className="mt-8 md:mt-0">
          {problems.map((p, i) => (
            <li key={p.problem} data-reveal style={{ ['--d' as string]: i }}>
              <Link to={`/servis#${p.service}`} className="group grid gap-3 border-b border-line py-7 transition-colors md:grid-cols-12 md:items-center md:gap-8 md:py-9">
                <span className="flex items-baseline gap-4 md:col-span-5">
                  <span className="label text-muted">{String(i + 1).padStart(2, '0')}</span>
                  <span className="font-display text-[clamp(1.35rem,1.1rem+1vw,1.9rem)] font-medium leading-tight tracking-[-0.025em] decoration-brand decoration-2 transition-colors duration-500 group-hover:text-muted group-hover:line-through">
                    {p.problem}
                  </span>
                </span>
                <span aria-hidden="true" className="hidden justify-center md:col-span-1 md:flex">
                  <ArrowRight className="size-5 text-muted transition-[transform,color] duration-500 ease-out-expo group-hover:translate-x-1.5 group-hover:text-brand" />
                </span>
                <span className="pl-10 text-[1.02rem] text-ink-soft transition-colors duration-500 group-hover:text-ink md:col-span-6 md:pl-0">{p.solution}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
