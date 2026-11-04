import { Link } from 'react-router';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { CATEGORY_LABEL, type Project } from '@/features/portfolio/schema';
import { cn } from '@/utils/cn';
import { hostOf, pad2 } from '@/utils/format';
import { ButtonA, ButtonLink } from './Button';
import { ProjectVisual } from './Media';
import { StatusBadge } from './StatusBadge';

export function ProjectMeta({ project, className }: { project: Project; className?: string }) {
  const rows: [string, string][] = [
    ['Jenis', project.projectType],
    ['Kategori', CATEGORY_LABEL[project.category]],
    ...(project.technologies.length ? [['Teknologi', project.technologies.slice(0, 4).join(' · ')] as [string, string]] : []),
  ];
  return (
    <dl className={cn('divide-y divide-line border-y border-line text-sm', className)}>
      {rows.map(([k, v]) => (
        <div key={k} className="grid grid-cols-[6.5rem_1fr] gap-4 py-3">
          <dt className="label pt-0.5 text-muted">{k}</dt>
          <dd className="text-ink-soft">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Large editorial plate for featured work. */
export function FeaturePlate({ project, index, flip, priority }: { project: Project; index: number; flip?: boolean; priority?: boolean }) {
  return (
    <article className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12" data-reveal>
      <Link
        to={`/kerja/${project.slug}`}
        viewTransition
        aria-label={`Kajian kes: ${project.title}`}
        className={cn('group block lg:col-span-7', flip && 'lg:order-2')}
      >
        <ProjectVisual project={project} priority={priority} sizes="(min-width: 1024px) 56vw, 100vw" />
      </Link>
      <div className={cn('lg:col-span-5', flip && 'lg:order-1')}>
        <div className="flex items-center gap-4">
          <span className="label text-saga-deep">{pad2(index + 1)}</span>
          <StatusBadge status={project.status} />
        </div>
        <h3 className="display-m mt-5">
          <Link to={`/kerja/${project.slug}`} viewTransition className="transition-colors hover:text-saga-deep">{project.title}</Link>
        </h3>
        {project.tagline && <p className="lede mt-4 text-ink-soft">{project.tagline}</p>}
        <ProjectMeta project={project} className="mt-7" />
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink to={`/kerja/${project.slug}`}>Lihat Kajian Kes</ButtonLink>
          {project.demoUrl && <ButtonA href={project.demoUrl} variant="outline">Buka {project.status === 'demo' ? 'Demo' : 'Laman'}</ButtonA>}
        </div>
      </div>
    </article>
  );
}

/** Grid tile used in the portfolio listing and related projects. */
export function ProjectTile({ project, large, priority }: { project: Project; large?: boolean; priority?: boolean }) {
  return (
    <article className="group relative" data-reveal>
      <ProjectVisual project={project} priority={priority} sizes={large ? '(min-width: 1024px) 58vw, 100vw' : '(min-width: 1024px) 40vw, (min-width: 640px) 50vw, 100vw'} />
      <div className="mt-5 flex items-start justify-between gap-6">
        <div className="min-w-0">
          <p className="label flex flex-wrap items-center gap-x-3 gap-y-1 text-muted">
            <span>{CATEGORY_LABEL[project.category]}</span>
            <span aria-hidden="true">/</span>
            <span>{project.projectType}</span>
          </p>
          <h3 className={cn('mt-2 font-display font-semibold tracking-[-0.025em]', large ? 'text-[clamp(1.6rem,1.2rem+1.4vw,2.4rem)] leading-[1.05]' : 'text-[1.45rem] leading-tight')}>
            <Link to={`/kerja/${project.slug}`} viewTransition className="after:absolute after:inset-0 after:content-['']">
              {project.title}
            </Link>
          </h3>
          <p className="mt-2 line-clamp-2 max-w-[52ch] text-[0.95rem] text-ink-soft">{project.tagline ?? project.description}</p>
        </div>
        <span aria-hidden="true" className="mt-1 grid size-11 shrink-0 place-items-center rounded-full border border-line-strong transition-[background-color,color,transform] duration-500 ease-out-expo group-hover:-rotate-45 group-hover:border-ink group-hover:bg-ink group-hover:text-paper">
          <ArrowRight className="size-4" />
        </span>
      </div>
      <div className="relative z-10 mt-4 flex flex-wrap items-center gap-3">
        <StatusBadge status={project.status} />
        {project.demoUrl && (
          <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="label link-underline inline-flex min-w-0 max-w-full items-center gap-1 text-ink-soft hover:text-ink">
            <span className="min-w-0 truncate">{hostOf(project.demoUrl)}</span> <ArrowUpRight className="size-3.5" aria-hidden="true" />
            <span className="sr-only">(dibuka dalam tab baharu)</span>
          </a>
        )}
      </div>
    </article>
  );
}
