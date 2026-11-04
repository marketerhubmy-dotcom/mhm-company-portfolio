import { cn } from '@/utils/cn';

/** Original MHM CENTER mark: a 3×3 grid with the centre cell lit — "the center". */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn('size-6', className)}>
      {[0, 1, 2].flatMap((r) =>
        [0, 1, 2].map((c) => (
          <rect
            key={`${r}${c}`}
            x={1 + c * 8}
            y={1 + r * 8}
            width="6"
            height="6"
            rx={r === 1 && c === 1 ? 3 : 1}
            className={r === 1 && c === 1 ? 'fill-saga' : 'fill-current'}
            opacity={r === 1 && c === 1 ? 1 : (r + c) % 2 === 0 ? 1 : 0.35}
          />
        )),
      )}
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark />
      <span className="font-display text-[1.05rem] font-[680] leading-none tracking-[-0.03em]">
        MHM<span className="font-[480] opacity-70"> CENTER</span>
      </span>
    </span>
  );
}
