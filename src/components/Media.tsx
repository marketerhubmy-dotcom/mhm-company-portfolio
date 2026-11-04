import { useEffect, useRef, useState } from 'react';
import type { Project, ProjectImage } from '@/features/portfolio/schema';
import { CATEGORY_LABEL } from '@/features/portfolio/schema';
import { cn } from '@/utils/cn';
import { LogoMark } from './Logo';

export function Img({ image, sizes, priority, className, imgClassName }: { image: ProjectImage; sizes: string; priority?: boolean; className?: string; imgClassName?: string }) {
  const ref = useRef<HTMLImageElement>(null);
  // Above-the-fold (priority) images are never hidden while loading — only lazy ones fade in.
  const [loaded, setLoaded] = useState(!!priority);
  useEffect(() => { if (ref.current?.complete) setLoaded(true); }, []);
  const srcSet = image.srcset ? Object.entries(image.srcset).map(([w, s]) => `${s} ${w}w`).join(', ') : undefined;
  return (
    <div className={cn('relative overflow-hidden bg-paper-2', !loaded && 'skeleton', className)} style={{ aspectRatio: `${image.width} / ${image.height}` }}>
      <img
        ref={ref}
        src={image.src}
        srcSet={srcSet}
        sizes={srcSet ? sizes : undefined}
        width={image.width}
        height={image.height}
        alt={image.alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={() => setLoaded(true)}
        className={cn('absolute inset-0 size-full object-cover object-top transition-opacity duration-700', loaded ? 'opacity-100' : 'opacity-0', imgClassName)}
      />
    </div>
  );
}

export function BrowserFrame({ image, url, sizes, priority, className, zoom = true }: { image: ProjectImage; url?: string | null; sizes: string; priority?: boolean; className?: string; zoom?: boolean }) {
  return (
    <figure className={cn('overflow-hidden rounded-[0.9rem] border border-ink/15 bg-ink-2 shadow-[0_1px_0_rgb(255_255_255/0.06)_inset,0_30px_60px_-30px_rgb(18_19_17/0.45)]', className)}>
      <div className="flex h-8 items-center gap-3 border-b border-line-dark px-3.5" aria-hidden="true">
        <span className="flex gap-1.5">{[0, 1, 2].map((i) => <span key={i} className="size-2.5 rounded-full bg-paper/20" />)}</span>
        {url && <span className="label min-w-0 truncate !text-[0.62rem] !tracking-[0.04em] !normal-case text-paper/45">{url.replace(/^https:\/\//, '')}</span>}
      </div>
      <div className="overflow-hidden">
        <Img image={image} sizes={sizes} priority={priority} imgClassName={zoom ? 'transition-[transform,opacity] duration-[1.2s] ease-out-expo group-hover:scale-[1.035]' : undefined} />
      </div>
    </figure>
  );
}

export function PhoneFrame({ image, sizes, priority, className }: { image: ProjectImage; sizes: string; priority?: boolean; className?: string }) {
  return (
    <figure className={cn('rounded-[2rem] bg-ink p-[0.45rem] shadow-[0_30px_60px_-28px_rgb(18_19_17/0.55)]', className)}>
      <div className="overflow-hidden rounded-[1.6rem]">
        <Img image={image} sizes={sizes} priority={priority} className="!aspect-[390/780]" />
      </div>
    </figure>
  );
}

/** Clearly-labelled temporary placeholder — used when no real screenshot exists yet. */
export function PlaceholderPlate({ project, className }: { project: Project; className?: string }) {
  return (
    <div className={cn('paper-grain relative flex aspect-[16/10] flex-col justify-between overflow-hidden rounded-[0.9rem] border border-line bg-paper-2 p-6', className)}>
      <div className="flex items-center justify-between text-muted">
        <span className="label">{CATEGORY_LABEL[project.category]}</span>
        <LogoMark className="h-5 opacity-40" />
      </div>
      <p className="display-s max-w-[14ch] text-ink/80">{project.title}</p>
      <span className="label text-muted">Imej sementara — tangkapan skrin akan ditambah</span>
    </div>
  );
}

/** Picks the right presentation for a project's cover. */
export function ProjectVisual({ project, sizes, priority, variant = 'card', className }: { project: Project; sizes: string; priority?: boolean; variant?: 'card' | 'hero'; className?: string }) {
  const cover = project.thumbnail;
  if (!cover) return <PlaceholderPlate project={project} className={className} />;
  if (cover.frame === 'mobile') {
    const phones = [cover, ...project.galleryImages.filter((g) => g.src !== cover.src && g.frame === 'mobile')].slice(0, 3);
    return (
      <div className={cn('relative flex aspect-[16/11] items-center justify-center gap-[3%] overflow-hidden rounded-[0.9rem] bg-brand-wash px-[6%]', variant === 'hero' && 'aspect-[16/9] md:aspect-[21/10]', className)}>
        <div aria-hidden="true" className="guides absolute inset-0 opacity-60" />
        {phones.map((img, i) => (
          <PhoneFrame
            key={img.src}
            image={img}
            sizes={variant === 'hero' ? '(min-width: 768px) 22vw, 30vw' : '(min-width: 768px) 14vw, 28vw'}
            priority={priority && i === 0}
            className={cn(
              'relative w-[29%] max-w-[15rem] transition-transform duration-[1.1s] ease-out-expo',
              i === 0 && 'z-10 group-hover:-translate-y-2',
              i === 1 && 'translate-y-[9%] group-hover:translate-y-[6%]',
              i === 2 && 'translate-y-[-6%] group-hover:translate-y-[-9%]',
            )}
          />
        ))}
      </div>
    );
  }
  return <BrowserFrame image={cover} url={project.demoUrl} sizes={sizes} priority={priority} className={className} />;
}
