import { SectionLabel } from '@/components/SectionLabel';
import { techGroups } from '@/data/content';

export function Tech() {
  return (
    <section className="section-y border-t border-line bg-paper-2" aria-labelledby="tech-title">
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4" data-reveal>
          <SectionLabel n="06">Teknologi</SectionLabel>
          <h2 id="tech-title" className="display-m mt-6">
            Alat moden, dipilih ikut <span className="serif-accent">keperluan.</span>
          </h2>
          <p className="mt-6 max-w-sm text-ink-soft">Kami pilih teknologi yang laju, boleh diselenggara dan berpatutan untuk dihoskan — bukan yang paling bergaya.</p>
        </div>
        <div className="lg:col-span-8">
          <dl className="grid border-t border-ink sm:grid-cols-2">
            {techGroups.map((g, i) => (
              <div key={g.title} className="border-b border-line py-6 sm:odd:pr-8 sm:even:border-l sm:even:pl-8" data-reveal style={{ ['--d' as string]: i % 2 }}>
                <dt className="label text-muted">{String(i + 1).padStart(2, '0')} · {g.title}</dt>
                <dd className="mt-4">
                  <ul className="flex flex-wrap gap-2">
                    {g.items.map((t) => (
                      <li key={t} className="rounded-md border border-line-strong bg-paper px-2.5 py-1.5 text-[0.88rem] text-ink-soft">{t}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
