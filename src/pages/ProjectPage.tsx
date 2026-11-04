import { Link, useParams } from 'react-router';
import { ArrowLeft, Info } from 'lucide-react';
import { Seo } from '@/components/Seo';
import { ButtonA, ButtonLink } from '@/components/Button';
import { StatusBadge } from '@/components/StatusBadge';
import { ProjectVisual } from '@/components/Media';
import { Gallery } from '@/components/Gallery';
import { ProjectTile } from '@/components/ProjectCards';
import { SectionLabel } from '@/components/SectionLabel';
import { site } from '@/config/site';
import { services } from '@/data/services';
import { getProject, relatedProjects } from '@/features/portfolio/data';
import { CATEGORY_LABEL, STATUS_LABEL, type Project } from '@/features/portfolio/schema';
import { FinalCta } from '@/sections/FinalCta';
import { formatDate, hostOf, pad2 } from '@/utils/format';
import NotFoundPage from './NotFoundPage';

function projectLd(p: Project) {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: p.title,
      headline: p.tagline ?? p.title,
      description: p.description,
      url: `${site.url}/kerja/${p.slug}`,
      dateModified: p.updatedAt,
      inLanguage: 'ms',
      genre: p.projectType,
      keywords: [CATEGORY_LABEL[p.category], ...p.technologies].join(', '),
      ...(p.thumbnail ? { image: `${site.url}${p.thumbnail.src}` } : {}),
      creator: { '@type': 'Organization', name: site.name, url: site.url },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Utama', item: `${site.url}/` },
        { '@type': 'ListItem', position: 2, name: 'Hasil Kerja', item: `${site.url}/kerja` },
        { '@type': 'ListItem', position: 3, name: p.title, item: `${site.url}/kerja/${p.slug}` },
      ],
    },
  ];
}

export default function ProjectPage() {
  const { slug = '' } = useParams();
  const p = getProject(slug);
  if (!p) return <NotFoundPage />;
  const cs = p.caseStudy ?? {};
  const related = relatedProjects(p);
  const service = services.find((s) => s.categories.includes(p.category));
  const isDemo = p.status !== 'production';

  const meta: [string, React.ReactNode][] = [
    ['Status', <StatusBadge key="s" status={p.status} />],
    ['Jenis', p.projectType],
    ['Kategori', CATEGORY_LABEL[p.category]],
    ['Dikemas kini', formatDate(p.updatedAt)],
  ];

  return (
    <article>
      <Seo
        title={`${p.title} · Kajian Kes`}
        description={p.description}
        path={`/kerja/${p.slug}`}
        image={p.thumbnail?.src}
        type="article"
        jsonLd={projectLd(p)}
      />

      {/* Hero */}
      <header className="paper-grain relative pt-[calc(var(--header-h)+2.5rem)] md:pt-[calc(var(--header-h)+4rem)]">
        <div className="guides pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="container-x relative">
          <nav aria-label="Breadcrumb" className="enter label flex items-center gap-3 text-muted" style={{ ['--i' as string]: -4 }}>
            <Link to="/kerja" viewTransition className="link-underline inline-flex items-center gap-1.5 text-ink">
              <ArrowLeft className="size-3.5" aria-hidden="true" /> Hasil Kerja
            </Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page" className="truncate">{p.title}</span>
          </nav>

          <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className="enter label text-saga-deep" style={{ ['--i' as string]: -2 }}>Kajian kes · {CATEGORY_LABEL[p.category]}</p>
              <h1 className="display-l mt-5">
                <span className="line-mask"><span>{p.title}</span></span>
              </h1>
              {p.tagline && <p className="enter lede mt-6 max-w-2xl text-ink-soft" style={{ ['--i' as string]: 1 }}>{p.tagline}</p>}
            </div>
            <div className="enter flex flex-col gap-3 sm:flex-row lg:col-span-4 lg:flex-col lg:items-stretch" style={{ ['--i' as string]: 2 }}>
              {p.demoUrl && <ButtonA href={p.demoUrl}>{isDemo ? 'Cuba Demo Langsung' : 'Lawati Laman'}</ButtonA>}
              <ButtonLink to={`/hubungi?servis=${service?.id ?? ''}`} variant="outline">Bincang Projek Serupa</ButtonLink>
            </div>
          </div>

          <dl className="enter mt-12 grid grid-cols-2 border-t border-line md:grid-cols-4" style={{ ['--i' as string]: 3 }}>
            {meta.map(([k, v]) => (
              <div key={k} className="border-b border-line py-5 pr-4 md:border-b-0">
                <dt className="label text-muted">{k}</dt>
                <dd className="mt-2 text-[0.95rem]">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      <div className="container-x">
        <div className="enter" style={{ ['--i' as string]: 4 }}>
          <ProjectVisual project={p} priority variant="hero" sizes="(min-width: 1376px) 1280px, 100vw" />
        </div>
      </div>

      {/* Narrative */}
      <section className="section-y" aria-label="Ringkasan projek">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <div className="space-y-8 lg:sticky lg:top-28">
              {p.technologies.length > 0 && (
                <div data-reveal>
                  <p className="label text-muted">Teknologi</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {p.technologies.map((t) => <li key={t} className="rounded-md border border-line-strong px-2.5 py-1.5 text-sm text-ink-soft">{t}</li>)}
                  </ul>
                </div>
              )}
              {p.demoUrl && (
                <div data-reveal>
                  <p className="label text-muted">Pautan {isDemo ? 'demo' : 'laman'}</p>
                  <a href={p.demoUrl} target="_blank" rel="noopener noreferrer" className="link-underline mt-3 inline-block break-all text-[0.95rem]">
                    {hostOf(p.demoUrl)} ↗<span className="sr-only">(dibuka dalam tab baharu)</span>
                  </a>
                </div>
              )}
              {cs.tryIt && cs.tryIt.length > 0 && (
                <div className="rounded-xl border border-line bg-paper-2 p-6" data-reveal>
                  <p className="label text-ink">Cuba ini dalam demo</p>
                  <ol className="mt-4 space-y-3 text-sm text-ink-soft">
                    {cs.tryIt.map((t, i) => (
                      <li key={t} className="grid grid-cols-[1.5rem_1fr] gap-2"><span className="label pt-0.5 text-saga-deep">{i + 1}</span>{t}</li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </aside>

          <div className="space-y-16 lg:col-span-7 lg:col-start-6">
            <div data-reveal>
              <SectionLabel n="1">Pengenalan</SectionLabel>
              <p className="mt-6 font-display text-[clamp(1.35rem,1.1rem+1vw,1.9rem)] font-medium leading-[1.3] tracking-[-0.02em]">{cs.intro ?? p.description}</p>
            </div>
            {cs.challenge && (
              <div data-reveal>
                <SectionLabel n="2">Cabaran bisnes</SectionLabel>
                <p className="lede mt-6 text-ink-soft">{cs.challenge}</p>
              </div>
            )}
            {cs.solution && (
              <div data-reveal>
                <SectionLabel n="3">Pendekatan penyelesaian</SectionLabel>
                <p className="lede mt-6 text-ink-soft">{cs.solution}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      {cs.features && cs.features.length > 0 && (
        <section className="section-y bg-ink text-paper" aria-labelledby="features-title">
          <div className="container-x">
            <div className="grid gap-6 md:grid-cols-12 md:items-end" data-reveal>
              <div className="md:col-span-8">
                <SectionLabel n="4" dark>Ciri utama</SectionLabel>
                <h2 id="features-title" className="display-m mt-6">Apa yang boleh anda <span className="serif-accent text-saga-bright">lihat & cuba.</span></h2>
              </div>
              <p className="text-paper/65 md:col-span-4">Hanya ciri yang telah disemak pada {isDemo ? 'demo' : 'laman'} langsung disenaraikan di sini.</p>
            </div>
            <ol className="mt-14 grid border-l border-t border-line-dark sm:grid-cols-2 lg:grid-cols-3">
              {cs.features.map((f, i) => (
                <li key={f.title} className="border-b border-r border-line-dark p-7 md:p-8" data-reveal style={{ ['--d' as string]: i % 3 }}>
                  <span className="label text-saga-bright">{pad2(i + 1)}</span>
                  <h3 className="mt-6 font-display text-[1.3rem] font-semibold leading-tight tracking-[-0.02em]">{f.title}</h3>
                  <p className="mt-3 text-[0.95rem] text-paper/70">{f.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* Gallery */}
      {p.galleryImages.length > 0 && (
        <section className="section-y" aria-labelledby="gallery-title">
          <div className="container-x">
            <div data-reveal>
              <SectionLabel n="5">Tangkapan skrin</SectionLabel>
              <h2 id="gallery-title" className="display-m mt-6">Daripada {isDemo ? 'demo' : 'laman'} <span className="serif-accent">sebenar.</span></h2>
            </div>
            <div className="mt-12">
              <Gallery images={p.galleryImages} title={p.title} />
            </div>
          </div>
        </section>
      )}

      {/* Honesty notes */}
      {(cs.demoNotes?.length || isDemo) && (
        <section className="pb-[var(--section-y)]" aria-labelledby="notes-title">
          <div className="container-x">
            <div className="grid gap-6 rounded-2xl border border-amber/30 bg-[#f7eedc] p-7 md:grid-cols-12 md:p-10" data-reveal>
              <div className="flex items-start gap-3 md:col-span-4">
                <Info className="mt-1 size-5 shrink-0 text-amber" aria-hidden="true" />
                <h2 id="notes-title" className="font-display text-xl font-semibold tracking-[-0.02em]">Nota: {STATUS_LABEL[p.status]}</h2>
              </div>
              <ul className="space-y-3 text-[0.95rem] text-ink-soft md:col-span-8">
                {(cs.demoNotes?.length ? cs.demoNotes : ['Projek ini bukan sistem production yang aktif.']).map((n) => (
                  <li key={n} className="grid grid-cols-[1rem_1fr] gap-2"><span aria-hidden="true" className="text-amber">—</span>{n}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* Related */}
      {related.length > 0 && (
        <section className="section-y border-t border-line" aria-labelledby="related-title">
          <div className="container-x">
            <div className="flex flex-wrap items-end justify-between gap-6" data-reveal>
              <div>
                <SectionLabel>Projek lain</SectionLabel>
                <h2 id="related-title" className="display-m mt-6">Lihat kerja <span className="serif-accent">seterusnya.</span></h2>
              </div>
              <ButtonLink to="/kerja" variant="outline">Semua Hasil Kerja</ButtonLink>
            </div>
            <div className="mt-14 grid gap-x-10 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => <ProjectTile key={r.slug} project={r} />)}
            </div>
          </div>
        </section>
      )}

      <FinalCta title={`Perlukan ${service ? service.title : 'sistem'} seperti ini? Mari`} accent="bincang." />
    </article>
  );
}
