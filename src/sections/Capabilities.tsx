import { SectionLabel } from '@/components/SectionLabel';
import { capabilities } from '@/data/content';

export function Capabilities() {
  return (
    <section className="section-y bg-paper-2" aria-labelledby="cap-title">
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4" data-reveal>
          <div className="lg:sticky lg:top-28">
            <SectionLabel n="02">Keupayaan teras</SectionLabel>
            <h2 id="cap-title" className="display-m mt-6">
              Empat perkara yang kami <span className="serif-accent">bina</span> untuk bisnes.
            </h2>
            <p className="mt-6 max-w-sm text-ink-soft">Setiap projek bermula dengan satu soalan: apa yang bisnes ini perlu lakukan dengan lebih baik?</p>
          </div>
        </div>
        <ol className="grid border-l border-t border-line sm:grid-cols-2 lg:col-span-8">
          {capabilities.map((c, i) => (
            <li key={c.n} className="group relative border-b border-r border-line p-7 transition-colors duration-500 hover:bg-paper md:p-9" data-reveal style={{ ['--d' as string]: i }}>
              <span className="font-display text-[clamp(3.5rem,2.5rem+3vw,5.5rem)] font-[300] leading-none tracking-[-0.05em] text-ink/15 transition-colors duration-500 group-hover:text-brand">{c.n}</span>
              <h3 className="display-s mt-8">{c.title}</h3>
              <p className="mt-3 text-ink-soft">{c.body}</p>
              <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-1">
                {c.services.map((s) => <li key={s} className="label text-muted">{s}</li>)}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
