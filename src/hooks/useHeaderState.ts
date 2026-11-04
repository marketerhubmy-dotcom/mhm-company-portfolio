import { useEffect, useState } from 'react';

/** scrolled → solid header; hidden → slide away while scrolling down (shown again on scroll up). */
export function useHeaderState(locked: boolean) {
  const [state, setState] = useState({ scrolled: false, hidden: false });
  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - last;
        setState((s) => {
          const scrolled = y > 16;
          const hidden = locked ? false : y > 160 && delta > 4 ? true : delta < -4 || y < 160 ? false : s.hidden;
          return s.scrolled === scrolled && s.hidden === hidden ? s : { scrolled, hidden };
        });
        last = y;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, [locked]);
  return state;
}
