import { useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { Link, useSearchParams } from 'react-router';
import { ArrowUpRight, LayoutGrid, List, Search, X } from 'lucide-react';
import { Seo } from '@/components/Seo';
import { SectionLabel } from '@/components/SectionLabel';
import { StatusBadge } from '@/components/StatusBadge';
import { ProjectTile } from '@/components/ProjectCards';
import { Img } from '@/components/Media';
import { Button } from '@/components/Button';
import { categoryCounts, filterProjects, isCategory, projects, type Filters } from '@/features/portfolio/data';
import { CATEGORY_LABEL, STATUSES, STATUS_LABEL, type ProjectStatus } from '@/features/portfolio/schema';
import { FinalCta } from '@/sections/FinalCta';
import { cn } from '@/utils/cn';
import { pad2 } from '@/utils/format';

const STATUS_HELP: Record<ProjectStatus, string> = {
  production: 'Sistem yang dilancarkan dan digunakan oleh bisnes.',
  demo: 'Demo portfolio dengan data rekaan — selamat untuk dicuba.',
  prototype: 'Konsep atau prototaip interaktif, bukan produk aktif.',
  'in-development': 'Sedang dibina, belum dilancarkan.',
};

/** Animate list changes with the View Transitions API when available. */
function withTransition(update: () => void) {
  const d = document as Document & { startViewTransition?: (cb: () => void) => unknown };
  if (d.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) d.startViewTransition(() => flushSync(update));
  else update();
}

const tileLayout = ['lg:col-span-7', 'lg:col-span-5 lg:mt-28', 'lg:col-span-5', 'lg:col-span-7 lg:mt-28'];

export default function WorkPage() {
  const [params, setParams] = useSearchParams();
  const cat = params.get('kategori');
  const st = params.get('status');
  const filters: Filters = {
    q: params.get('q') ?? '',
    category: isCategory(cat) ? cat : 'semua',
    status: (STATUSES as readonly string[]).includes(st ?? '') ? (st as ProjectStatus) : 'semua',
  };
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const results = useMemo(() => filterProjects(projects, filters), [filters.q, filters.category, filters.status]);
  const counts = useMemo(() => categoryCounts(projects), []);
  const statuses = useMemo(() => STATUSES.filter((s) => projects.some((p) => p.status === s)), []);

  const update = (key: string, value: string | null, animate = true) => {
    const next = new URLSearchParams(params);
    if (!value || value === 'semua') next.delete(key);
    else next.set(key, value);
    const run = () => setParams(next, { replace: true, preventScrollReset: true });
    if (animate) withTransition(run);
    else run();
  };
  const reset = () => withTransition(() => setParams(new URLSearchParams(), { replace: true, preventScrollReset: true }));
  const active = filters.q || filters.category !== 'semua' || filters.status !== 'semua';

  return (
    <>
      <Seo
        title="Hasil Kerja"
        description="Portfolio MHM Center: landing page, sistem ERP, web app dan projek digital yang boleh dibuka dan dicuba — setiap satu dilabel sebagai sistem sebenar, demo atau prototaip."
        path="/kerja"
      />
      <section className="paper-grain relative pt-[calc(var(--header-h)+3rem)] md:pt-[calc(var(--header-h)+5rem)]">
        <div className="guides pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="container-x relative">
          <SectionLabel n="K">Hasil kerja</SectionLabel>
          <h1 className="display-xl mt-8">
            <span className="line-mask"><span>Kerja yang boleh</span></span>
            <span className="line-mask"><span style={{ ['--i' as string]: 1 }}>anda <span className="serif-accent text-saga-deep">cuba sendiri.</span></span></span>
          </h1>
          <div className="enter mt-10 grid gap-8 border-t border-line pt-8 md:grid-cols-12" style={{ ['--i' as string]: 1 }}>
            <p className="lede text-ink-soft md:col-span-6">
              Setiap projek di sini mempunyai kajian kes dan, jika tersedia, pautan demo yang boleh dibuka. Kami label setiap satu dengan jujur.
            </p>
            <dl className="grid gap-3 md:col-span-5 md:col-start-8">
              {statuses.map((s) => (
                <div key={s} className="flex items-start gap-4">
                  <dt className="shrink-0"><StatusBadge status={s} /></dt>
                  <dd className="pt-0.5 text-sm text-muted">{STATUS_HELP[s]}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="pb-[var(--section-y)] pt-14" aria-labelledby="results-title">
        <h2 id="results-title" className="sr-only">Senarai projek</h2>
        <div className="container-x">
          {/* Controls */}
          <div className="sticky top-0 z-30 -mx-[var(--gutter)] border-y border-line bg-paper/90 px-[var(--gutter)] py-4 backdrop-blur-md">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div role="group" aria-label="Tapis kategori" className="no-scrollbar -mx-[var(--gutter)] flex gap-2 overflow-x-auto px-[var(--gutter)] lg:mx-0 lg:px-0">
                {[{ category: 'semua' as const, count: projects.length }, ...counts].map((c) => {
                  const on = filters.category === c.category;
                  return (
                    <button
                      key={c.category}
                      type="button"
                      aria-pressed={on}
                      onClick={() => update('kategori', c.category)}
                      className={cn(
                        'inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm transition-colors duration-300',
                        on ? 'border-ink bg-ink text-paper' : 'border-line-strong text-ink-soft hover:border-ink hover:text-ink',
                      )}
                    >
                      {c.category === 'semua' ? 'Semua' : CATEGORY_LABEL[c.category]}
                      <span className={cn('label !tracking-normal', on ? 'text-paper/60' : 'text-muted')}>{c.count}</span>
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-2">
                <label className="relative flex-1 lg:w-72 lg:flex-none">
                  <span className="sr-only">Cari projek</span>
                  <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" />
                  <input
                    type="search"
                    value={filters.q}
                    onChange={(e) => update('q', e.target.value, false)}
                    placeholder="Cari: ERP, landing page…"
                    className="h-10 w-full rounded-full border border-line-strong bg-paper pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-muted focus:border-ink"
                  />
                </label>
                {statuses.length > 1 && (
                  <select
                    aria-label="Tapis status"
                    value={filters.status}
                    onChange={(e) => update('status', e.target.value)}
                    className="h-10 rounded-full border border-line-strong bg-paper px-4 text-sm outline-none focus:border-ink"
                  >
                    <option value="semua">Semua status</option>
                    {statuses.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
                  </select>
                )}
                <div role="group" aria-label="Paparan" className="hidden rounded-full border border-line-strong p-1 sm:flex">
                  {([['grid', LayoutGrid, 'Grid'], ['list', List, 'Indeks']] as const).map(([v, Icon, label]) => (
                    <button
                      key={v}
                      type="button"
                      aria-pressed={view === v}
                      aria-label={`Paparan ${label}`}
                      onClick={() => withTransition(() => setView(v))}
                      className={cn('grid size-8 place-items-center rounded-full transition-colors', view === v ? 'bg-ink text-paper' : 'text-ink-soft hover:text-ink')}
                    >
                      <Icon className="size-4" aria-hidden="true" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <p className="label mt-8 text-muted" aria-live="polite">
            {results.length} projek{active ? ' sepadan' : ''}
            {active && (
              <button type="button" onClick={reset} className="link-underline ml-4 inline-flex items-center gap-1 text-ink">
                <X className="size-3.5" aria-hidden="true" /> Kosongkan penapis
              </button>
            )}
          </p>

          {results.length === 0 ? (
            <EmptyState onReset={reset} />
          ) : view === 'grid' ? (
            <div className="mt-10 grid gap-x-10 gap-y-20 lg:grid-cols-12" style={{ viewTransitionName: 'work-results' }}>
              {results.map((p, i) => (
                <div key={p.slug} className={tileLayout[i % 4]}>
                  <ProjectTile project={p} large={i % 4 === 0 || i % 4 === 3} priority={i < 2} />
                </div>
              ))}
            </div>
          ) : (
            <IndexList list={results} />
          )}
        </div>
      </section>

      <FinalCta title="Projek anda boleh jadi yang" accent="seterusnya." />
    </>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="mt-10 grid place-items-center rounded-2xl border border-dashed border-line-strong px-6 py-20 text-center">
      <p className="font-display text-2xl font-semibold tracking-[-0.02em]">Tiada projek sepadan.</p>
      <p className="mt-3 max-w-md text-ink-soft">Cuba kata kunci lain atau kosongkan penapis. Projek baharu ditambah dari semasa ke semasa.</p>
      <Button variant="outline" className="mt-8" onClick={onReset}>Kosongkan Penapis</Button>
    </div>
  );
}

/** Editorial index with a cursor-following preview (fine pointers only). */
function IndexList({ list }: { list: typeof projects }) {
  const preview = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);
  const move = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || !preview.current) return;
    preview.current.style.transform = `translate3d(${e.clientX + 24}px, ${e.clientY - 120}px, 0)`;
  };
  const current = hover !== null ? list[hover] : undefined;
  return (
    <div className="relative mt-10" onPointerMove={move} onPointerLeave={() => setHover(null)} style={{ viewTransitionName: 'work-results' }}>
      <ul className="border-t border-ink">
        {list.map((p, i) => (
          <li key={p.slug} onPointerEnter={() => setHover(i)}>
            <Link to={`/kerja/${p.slug}`} viewTransition className="group grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 border-b border-line py-6 md:grid-cols-[3.5rem_1.4fr_1fr_1fr_auto] md:gap-6">
              <span className="label text-muted">{pad2(i + 1)}</span>
              <span className="font-display text-[clamp(1.3rem,1rem+1.2vw,2.1rem)] font-semibold leading-tight tracking-[-0.03em] transition-transform duration-500 ease-out-expo group-hover:translate-x-2">{p.title}</span>
              <span className="hidden text-sm text-ink-soft md:block">{CATEGORY_LABEL[p.category]} · {p.projectType}</span>
              <span className="hidden md:block"><StatusBadge status={p.status} /></span>
              <ArrowUpRight aria-hidden="true" className="size-5 transition-transform duration-500 ease-out-expo group-hover:rotate-45" />
            </Link>
          </li>
        ))}
      </ul>
      <div
        ref={preview}
        aria-hidden="true"
        className={cn(
          'pointer-events-none fixed left-0 top-0 z-40 hidden w-[22rem] overflow-hidden rounded-xl border border-ink/15 shadow-2xl transition-opacity duration-300 [@media(hover:hover)_and_(pointer:fine)]:block',
          current?.thumbnail ? 'opacity-100' : 'opacity-0',
        )}
      >
        {current?.thumbnail && <Img image={current.thumbnail} sizes="352px" className={current.thumbnail.frame === 'mobile' ? '!aspect-[4/3]' : ''} />}
      </div>
    </div>
  );
}
