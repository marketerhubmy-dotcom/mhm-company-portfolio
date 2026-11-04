import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import { Menu, X } from 'lucide-react';
import { nav, site } from '@/config/site';
import { useHeaderState } from '@/hooks/useHeaderState';
import { cn } from '@/utils/cn';
import { Logo } from '@/components/Logo';
import { ButtonLink } from '@/components/Button';

export function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { scrolled, hidden } = useHeaderState(open);
  const panel = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panel.current?.querySelector<HTMLElement>('a')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); toggle.current?.focus(); }
      if (e.key === 'Tab' && panel.current) {
        const items = [toggle.current, ...panel.current.querySelectorAll<HTMLElement>('a,button')].filter(Boolean) as HTMLElement[];
        const first = items[0]!, last = items[items.length - 1]!;
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; document.removeEventListener('keydown', onKey); };
  }, [open]);

  return (
    <>
      <a href="#main" className="label fixed left-4 top-3 z-[70] -translate-y-20 rounded-full bg-ink px-4 py-3 text-paper focus:translate-y-0">
        Langkau ke kandungan
      </a>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color] duration-500 ease-out-expo',
          hidden && !open ? '-translate-y-full' : 'translate-y-0',
          open ? 'bg-transparent' : scrolled ? 'border-b border-line bg-paper/85 backdrop-blur-md' : 'border-b border-transparent',
        )}
      >
        <div className="container-x flex h-[var(--header-h)] items-center justify-between gap-6">
          <Link to="/" viewTransition className={cn('relative z-[60] transition-colors', open ? 'text-paper' : 'text-ink')} aria-label={`${site.name} — laman utama`}>
            <Logo onDark={open} />
          </Link>

          <nav aria-label="Utama" className="hidden md:block">
            <ul className="flex items-center gap-1">
              {nav.map((n) => (
                <li key={n.to}>
                  <NavLink
                    to={n.to}
                    viewTransition
                    className={({ isActive }) =>
                      cn('relative rounded-full px-4 py-2 text-[0.93rem] transition-colors hover:text-ink', isActive ? 'text-ink' : 'text-ink-soft')
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {n.label}
                        <span aria-hidden="true" className={cn('absolute inset-x-4 -bottom-0.5 h-px origin-left bg-brand transition-transform duration-500 ease-out-expo', isActive ? 'scale-x-100' : 'scale-x-0')} />
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <span className="hidden md:block"><ButtonLink to="/hubungi" className="!min-h-10 !px-5 text-sm">Bincang Projek</ButtonLink></span>
            <button
              ref={toggle}
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Tutup menu' : 'Buka menu'}
              className={cn('relative z-[60] grid size-11 place-items-center rounded-full border transition-colors md:hidden', open ? 'border-line-dark text-paper' : 'border-line-strong text-ink')}
            >
              {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-menu"
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label="Menu navigasi"
        hidden={!open}
        className="fixed inset-0 z-40 bg-ink text-paper md:hidden"
      >
        <div className="guides-dark absolute inset-0 opacity-50" aria-hidden="true" />
        <nav aria-label="Mudah alih" className="container-x relative flex h-full flex-col pb-10 pt-28">
          <ul className="border-t border-line-dark">
            {[{ to: '/', label: 'Utama' }, ...nav].map((n, i) => (
              <li key={n.to} className="enter border-b border-line-dark" style={{ ['--i' as string]: i - 4 }}>
                <NavLink to={n.to} viewTransition className={({ isActive }) => cn('flex items-baseline justify-between py-5 font-display text-[2.1rem] font-semibold tracking-[-0.03em]', isActive && 'text-brand-bright')}>
                  {n.label}
                  <span className="label text-muted-dark">0{i + 1}</span>
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="mt-auto space-y-4">
            <ButtonLink to="/hubungi" variant="light" className="w-full">Bincang Projek Anda</ButtonLink>
            <p className="label text-center text-muted-dark">{site.tagline}</p>
          </div>
        </nav>
      </div>
    </>
  );
}
