import { Link } from 'react-router';
import { Seo } from '@/components/Seo';
import { ButtonLink } from '@/components/Button';
import { SectionLabel } from '@/components/SectionLabel';
import { StatusBadge } from '@/components/StatusBadge';
import { services } from '@/data/services';
import { projects } from '@/features/portfolio/data';
import { Process } from '@/sections/Process';
import { FinalCta } from '@/sections/FinalCta';
import { pad2 } from '@/utils/format';

export default function ServicesPage() {
  return (
    <>
      <Seo
        title="Servis"
        description="Landing page, website bisnes, e-commerce, web app custom, sistem CRM/ERP, SaaS, automasi AI dan automasi marketing — untuk siapa, masalah yang diselesaikan dan apa yang anda terima."
        path="/servis"
        jsonLd={[{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          itemListElement: services.map((s, i) => ({ '@type': 'ListItem', position: i + 1, item: { '@type': 'Service', name: s.title, description: s.short, provider: { '@type': 'Organization', name: 'MHM CENTER' }, areaServed: 'MY' } })),
        }]}
      />
      <section className="paper-grain relative pt-[calc(var(--header-h)+3rem)] md:pt-[calc(var(--header-h)+5rem)]">
        <div className="guides pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="container-x relative pb-16">
          <SectionLabel n="S">Servis</SectionLabel>
          <h1 className="display-xl mt-8">
            <span className="line-mask"><span>Dari halaman jualan</span></span>
            <span className="line-mask"><span style={{ ['--i' as string]: 1 }}>kepada <span className="serif-accent text-brand-deep">sistem penuh.</span></span></span>
          </h1>
          <p className="enter lede mt-10 max-w-2xl text-ink-soft" style={{ ['--i' as string]: 1 }}>
            Lapan servis, satu pendekatan: fahami bisnes dahulu, kemudian bina apa yang benar-benar diperlukan. Harga diberikan selepas skop dipersetujui — tiada pakej tetap yang memaksa.
          </p>
        </div>
      </section>

      <div className="container-x grid gap-12 pb-[var(--section-y)] lg:grid-cols-12">
        <nav aria-label="Senarai servis" className="hidden lg:col-span-3 lg:block">
          <ol className="sticky top-28 space-y-1 border-l border-line">
            {services.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="group -ml-px flex gap-3 border-l border-transparent py-1.5 pl-4 text-[0.93rem] text-ink-soft transition-colors hover:border-brand hover:text-ink">
                  <span className="label pt-0.5 text-muted">{pad2(i + 1)}</span>{s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="lg:col-span-9">
          {services.map((s, i) => {
            const direct = projects.filter((p) => s.categories.includes(p.category)).map((p) => ({ p, note: null as string | null }));
            const related = (s.relatedExamples ?? [])
              .map((r) => ({ p: projects.find((x) => x.slug === r.slug), note: r.note }))
              .filter((r): r is { p: (typeof projects)[number]; note: string } => !!r.p && !direct.some((d) => d.p.slug === r.p!.slug));
            const examples = [...direct, ...related];
            return (
              <section key={s.id} id={s.id} aria-labelledby={`${s.id}-t`} className="scroll-mt-24 border-t border-ink py-14 first:pt-10 md:py-20">
                <div className="grid gap-8 md:grid-cols-12" data-reveal>
                  <span className="label text-brand-deep md:col-span-1">{pad2(i + 1)}</span>
                  <div className="md:col-span-11">
                    <h2 id={`${s.id}-t`} className="display-m">{s.title}</h2>
                    <p className="lede mt-4 max-w-2xl text-ink-soft">{s.short}</p>
                  </div>
                </div>
                <div className="mt-10 grid gap-10 md:grid-cols-12" data-reveal>
                  <div className="md:col-span-5 md:col-start-2">
                    <h3 className="label text-muted">Untuk siapa</h3>
                    <p className="mt-3">{s.who}</p>
                    <h3 className="label mt-8 text-muted">Masalah yang diselesaikan</h3>
                    <ul className="mt-3 space-y-2.5">
                      {s.problems.map((p) => <li key={p} className="grid grid-cols-[1.2rem_1fr] text-ink-soft"><span aria-hidden="true" className="text-brand">—</span>{p}</li>)}
                    </ul>
                  </div>
                  <div className="md:col-span-5 md:col-start-8">
                    <h3 className="label text-muted">Hasil serahan biasa</h3>
                    <ul className="mt-3 divide-y divide-line border-y border-line">
                      {s.deliverables.map((d) => <li key={d} className="py-2.5 text-[0.95rem]">{d}</li>)}
                    </ul>
                    <h3 className="label mt-8 text-muted">Contoh kerja</h3>
                    {examples.length ? (
                      <ul className="mt-3 space-y-4">
                        {examples.map(({ p, note }) => (
                          <li key={p.slug}>
                            <span className="flex flex-wrap items-center gap-3">
                              <Link to={`/kerja/${p.slug}`} viewTransition className="link-underline font-medium">{p.title}</Link>
                              <StatusBadge status={p.status} />
                            </span>
                            {note && <span className="mt-1 block text-sm text-muted"><span className="label mr-2 text-ink-soft">Bahagian berkaitan</span>{note}</span>}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-3 text-sm text-muted">Contoh awam akan ditambah. Tanya kami untuk perbincangan projek berkaitan.</p>
                    )}
                    <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-line pt-6">
                      <p className="mr-auto text-sm"><span className="label mr-2 text-muted">Harga</span>{s.priceNote ?? 'Sebut harga ikut skop'}</p>
                      <ButtonLink to={`/hubungi?servis=${s.id}`} className="!min-h-11">Tanya Servis Ini</ButtonLink>
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </div>

      <div className="border-t border-line bg-paper-2"><Process n="P" /></div>
      <div className="pt-[var(--section-y)]"><FinalCta title="Tak pasti servis mana yang sesuai? Mari" accent="berbincang." /></div>
    </>
  );
}
