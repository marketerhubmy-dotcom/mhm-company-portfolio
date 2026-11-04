import { cn } from '@/utils/cn';

/**
 * Official MHM CENTER logo assets (source: brand/logo-mhm-center.png).
 * The navy lettering is invisible on dark surfaces, so every placement picks
 * the light or the on-dark variant explicitly.
 */
const MARK = { light: '/brand/mhm-mark.png', dark: '/brand/mhm-mark-on-dark.png', w: 204, h: 96 } as const;
const FULL = { light: '/brand/mhm-center-logo.png', dark: '/brand/mhm-center-logo-on-dark.png', w: 631, h: 480 } as const;

/** The "MHM" mark with swoosh and pixels. */
export function LogoMark({ className, onDark, alt = '' }: { className?: string; onDark?: boolean; alt?: string }) {
  return (
    <img
      src={onDark ? MARK.dark : MARK.light}
      width={MARK.w}
      height={MARK.h}
      alt={alt}
      aria-hidden={alt ? undefined : true}
      decoding="async"
      className={cn('h-8 w-auto select-none', className)}
      draggable={false}
    />
  );
}

/** Horizontal lockup for the header: mark + "CENTER" set like the logo (wide tracking). */
export function Logo({ className, onDark }: { className?: string; onDark?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark onDark={onDark} className="h-9" />
      <span className="sr-only">MHM</span>
      <span className={cn('font-display text-[0.95rem] font-[650] uppercase leading-none tracking-[0.32em]', onDark ? 'text-paper' : 'text-ink')}>Center</span>
    </span>
  );
}

/** Full stacked logo including the tagline. */
export function LogoFull({ className, onDark }: { className?: string; onDark?: boolean }) {
  return (
    <img
      src={onDark ? FULL.dark : FULL.light}
      width={FULL.w}
      height={FULL.h}
      alt="MHM CENTER — Digital Products, Better Future"
      decoding="async"
      className={cn('h-auto w-48 select-none', className)}
      draggable={false}
    />
  );
}
