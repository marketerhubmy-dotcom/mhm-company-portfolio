import { SectionLabel } from '@/components/SectionLabel';
import { process } from '@/data/content';

export function Process({ n = '05' }: { n?: string }) {
  return (
    <section className="section-y" aria-labelledby="proc-title">
      <div className="container-x">
        <div className="grid gap-6 md:grid-cols-12 md:items-end" data-reveal>
          <div className="md:col-span-7">
            <SectionLabel n={n}>Proses pembangunan</SectionLabel>
            <h2 id="proc-title" className="display-l mt-6">
              Jelas dari hari <span className="serif-accent">pertama.</span>
            </h2>
          </div>
          <p className="text-ink-soft md:col-span-4 md:col-start-9 md:pb-2">Anda tahu apa yang sedang dibina, bila boleh disemak dan apa langkah seterusnya — pada setiap fasa.</p>
        </div>

        <div className="relative mt-16">
          <div aria-hidden="true" className="absolute left-0 right-0 top-[1.15rem] hidden h-px bg-line lg:block" />
          <div aria-hidden="true" className="reveal-line absolute left-0 right-0 top-[1.15rem] hidden h-px bg-brand lg:block" data-reveal />
          <ol className="grid gap-10 lg:grid-cols-5 lg:gap-6">
            {process.map((s, i) => (
              <li key={s.n} className="relative grid grid-cols-[2.3rem_1fr] gap-5 lg:block" data-reveal style={{ ['--d' as string]: i + 1 }}>
                {i < process.length - 1 && <span aria-hidden="true" className="absolute bottom-[-2.5rem] left-[1.15rem] top-10 w-px bg-line lg:hidden" />}
                <span className="label relative z-10 grid size-[2.3rem] place-items-center rounded-full border border-ink bg-paper !tracking-normal">{s.n}</span>
                <div className="lg:mt-8 lg:pr-4">
                  <h3 className="font-display text-[1.35rem] font-semibold leading-tight tracking-[-0.02em]">{s.title}</h3>
                  <p className="mt-3 text-[0.95rem] text-ink-soft">{s.body}</p>
                  <p className="label mt-5 text-brand-deep">→ {s.output}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
