import { Plus } from 'lucide-react';
import { SectionLabel } from '@/components/SectionLabel';
import { faqs } from '@/data/content';

export function Faq({ n = '08' }: { n?: string }) {
  return (
    <section className="section-y border-t border-line" aria-labelledby="faq-title">
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4" data-reveal>
          <SectionLabel n={n}>Soalan lazim</SectionLabel>
          <h2 id="faq-title" className="display-m mt-6">Soalan yang selalu <span className="serif-accent">ditanya.</span></h2>
        </div>
        <div className="lg:col-span-8">
          {faqs.map((f, i) => (
            <details key={f.q} className="group border-b border-line first:border-t first:border-t-ink" data-reveal style={{ ['--d' as string]: i % 3 }}>
              <summary className="flex cursor-pointer items-start justify-between gap-6 py-6 font-display text-[clamp(1.1rem,1rem+0.5vw,1.35rem)] font-medium leading-snug tracking-[-0.015em] transition-colors hover:text-brand-deep">
                {f.q}
                <Plus aria-hidden="true" className="mt-1 size-5 shrink-0 transition-transform duration-500 ease-out-expo group-open:rotate-45" />
              </summary>
              <p className="max-w-[62ch] pb-7 pr-10 text-ink-soft">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
