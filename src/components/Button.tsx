import { Link } from 'react-router';
import type { ComponentProps, ReactNode } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { cn } from '@/utils/cn';

type Variant = 'primary' | 'outline' | 'light' | 'ghost-light' | 'brand' | 'contrast';
const base =
  'group/btn relative inline-flex min-h-12 items-center justify-center gap-2.5 overflow-hidden rounded-full px-6 text-[0.95rem] font-medium tracking-[-0.01em] transition-[color,border-color,transform] duration-500 ease-out-expo active:scale-[0.98] isolate select-none';
const variants: Record<Variant, string> = {
  primary: 'bg-ink text-paper hover:text-paper',
  outline: 'border border-line-strong text-ink hover:border-ink hover:text-paper',
  light: 'bg-paper text-ink hover:text-paper',
  'ghost-light': 'border border-line-dark text-paper hover:border-paper hover:text-ink',
  brand: 'bg-brand text-paper hover:text-ink',
  contrast: 'bg-paper text-ink hover:text-paper',
};
const fill: Record<Variant, string> = {
  primary: 'bg-brand',
  outline: 'bg-ink',
  light: 'bg-brand',
  'ghost-light': 'bg-paper',
  brand: 'bg-paper',
  contrast: 'bg-ink',
};

function Inner({ children, external, arrow = true, variant }: { children: ReactNode; external?: boolean; arrow?: boolean; variant: Variant }) {
  const Icon = external ? ArrowUpRight : ArrowRight;
  return (
    <>
      <span
        aria-hidden="true"
        className={cn('absolute inset-0 -z-10 origin-bottom scale-y-0 rounded-[inherit] transition-transform duration-500 ease-out-expo group-hover/btn:scale-y-100', fill[variant])}
      />
      <span>{children}</span>
      {arrow && (
        <Icon aria-hidden="true" className={cn('size-4 transition-transform duration-500 ease-out-expo', external ? 'group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5' : 'group-hover/btn:translate-x-1')} />
      )}
    </>
  );
}

type LinkProps = { to: string; variant?: Variant; arrow?: boolean; className?: string; children: ReactNode } & Omit<ComponentProps<typeof Link>, 'to' | 'className' | 'children'>;
export function ButtonLink({ to, variant = 'primary', arrow, className, children, ...rest }: LinkProps) {
  return (
    <Link to={to} viewTransition className={cn(base, variants[variant], className)} {...rest}>
      <Inner variant={variant} arrow={arrow}>{children}</Inner>
    </Link>
  );
}

type AProps = { href: string; variant?: Variant; arrow?: boolean; className?: string; children: ReactNode } & Omit<ComponentProps<'a'>, 'href' | 'className' | 'children'>;
export function ButtonA({ href, variant = 'primary', arrow, className, children, ...rest }: AProps) {
  const external = /^https?:/.test(href);
  return (
    <a href={href} className={cn(base, variants[variant], className)} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...rest}>
      <Inner variant={variant} arrow={arrow} external={external}>{children}</Inner>
      {external && <span className="sr-only">(dibuka dalam tab baharu)</span>}
    </a>
  );
}

type BtnProps = { variant?: Variant; arrow?: boolean } & ComponentProps<'button'>;
export function Button({ variant = 'primary', arrow = false, className, children, ...rest }: BtnProps) {
  return (
    <button className={cn(base, variants[variant], 'disabled:pointer-events-none disabled:opacity-50', className)} {...rest}>
      <Inner variant={variant} arrow={arrow}>{children}</Inner>
    </button>
  );
}
