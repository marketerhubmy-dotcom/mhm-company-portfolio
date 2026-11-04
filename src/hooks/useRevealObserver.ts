import { useEffect } from 'react';

/**
 * Observes every [data-reveal] element and marks it [data-in] once visible.
 * Re-scans on route change. Hidden-before-reveal styling only applies under
 * html.reveal-ready, so without JS (or with reduced motion) content is visible.
 */
export function useRevealObserver(key: string) {
  useEffect(() => {
    const root = document.documentElement;
    if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      root.classList.remove('reveal-ready');
      return;
    }
    root.classList.add('reveal-ready');
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.setAttribute('data-in', '');
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );
    const scan = () => document.querySelectorAll('[data-reveal]:not([data-in])').forEach((el) => io.observe(el));
    scan();
    // Catch elements rendered after filtering / async updates.
    const mo = new MutationObserver(scan);
    mo.observe(document.getElementById('main') ?? document.body, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); };
  }, [key]);
}
