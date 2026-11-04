import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import type { ProjectImage } from '@/features/portfolio/schema';
import { cn } from '@/utils/cn';
import { Img } from './Media';

/** Screenshot gallery with an accessible <dialog> lightbox (keyboard + swipe). */
export function Gallery({ images, title }: { images: ProjectImage[]; title: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  const touch = useRef<number | null>(null);
  const mobile = images.every((i) => i.frame === 'mobile');

  const open = (i: number) => { setIndex(i); dialog.current?.showModal(); };
  const go = useCallback((d: number) => setIndex((i) => (i + d + images.length) % images.length), [images.length]);

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    el.addEventListener('keydown', onKey);
    return () => el.removeEventListener('keydown', onKey);
  }, [go]);

  const current = images[index];
  return (
    <>
      <ul className={cn('grid gap-5', mobile ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5' : 'sm:grid-cols-2')}>
        {images.map((img, i) => (
          <li key={img.src} data-reveal style={{ ['--d' as string]: i % 3 }}>
            <figure>
              <button type="button" onClick={() => open(i)} className="group relative block w-full overflow-hidden rounded-xl border border-line text-left" aria-label={`Besarkan: ${img.alt}`}>
                <Img image={img} sizes={mobile ? '(min-width: 1024px) 18vw, 45vw' : '(min-width: 640px) 45vw, 100vw'} imgClassName="transition-[transform,opacity] duration-[1.2s] ease-out-expo group-hover:scale-[1.03]" />
                <span aria-hidden="true" className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-ink/80 text-paper opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <Maximize2 className="size-4" />
                </span>
              </button>
              {img.caption && <figcaption className="mt-3 text-sm text-muted"><span className="label mr-2 text-ink">{String(i + 1).padStart(2, '0')}</span>{img.caption}</figcaption>}
            </figure>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        aria-label={`Galeri ${title}`}
        className="m-0 h-full max-h-none w-full max-w-none bg-transparent p-0 text-paper backdrop:bg-ink/90"
        onClick={(e) => { if (e.target === e.currentTarget) dialog.current?.close(); }}
        onTouchStart={(e) => { touch.current = e.touches[0]?.clientX ?? null; }}
        onTouchEnd={(e) => {
          const start = touch.current; const end = e.changedTouches[0]?.clientX;
          if (start != null && end != null && Math.abs(end - start) > 50) go(end < start ? 1 : -1);
          touch.current = null;
        }}
      >
        {current && (
          <div className="flex h-full flex-col" onClick={(e) => { if (e.target === e.currentTarget) dialog.current?.close(); }}>
            <div className="container-x flex items-center justify-between py-4">
              <p className="label text-paper/70" aria-live="polite">{index + 1} / {images.length}</p>
              <button type="button" onClick={() => dialog.current?.close()} className="grid size-11 place-items-center rounded-full border border-line-dark hover:bg-paper hover:text-ink" aria-label="Tutup galeri" autoFocus>
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>
            <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 md:px-20" onClick={(e) => { if (e.target === e.currentTarget) dialog.current?.close(); }}>
              <img
                key={current.src}
                src={current.src}
                alt={current.alt}
                width={current.width}
                height={current.height}
                className="max-h-full w-auto max-w-full animate-[fade-up_0.5s_var(--ease-out-expo)] rounded-lg object-contain"
              />
              {images.length > 1 && (
                <>
                  <button type="button" onClick={() => go(-1)} className="absolute left-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-ink/70 hover:bg-paper hover:text-ink md:left-6" aria-label="Imej sebelumnya">
                    <ChevronLeft className="size-5" aria-hidden="true" />
                  </button>
                  <button type="button" onClick={() => go(1)} className="absolute right-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-ink/70 hover:bg-paper hover:text-ink md:right-6" aria-label="Imej seterusnya">
                    <ChevronRight className="size-5" aria-hidden="true" />
                  </button>
                </>
              )}
            </div>
            <p className="container-x py-5 text-center text-sm text-paper/75">{current.caption ?? current.alt}</p>
          </div>
        )}
      </dialog>
    </>
  );
}
