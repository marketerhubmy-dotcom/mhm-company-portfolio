import { useState } from 'react';
import { cn } from '@/utils/cn';

const steps = [
  { t: 'Iklan & Kandungan', d: 'Pelawat datang daripada Facebook, TikTok atau Google.' },
  { t: 'Landing Page', d: 'Tawaran jelas, bukti dan langkah pesanan di telefon.' },
  { t: 'Order & WhatsApp', d: 'Pesanan masuk tersusun, bukan bersepah dalam chat.' },
  { t: 'ERP / CRM', d: 'Bayaran, logistik, stok dan pasukan dalam satu sistem.' },
  { t: 'Automasi AI', d: 'Follow-up, notifikasi dan laporan berjalan sendiri.' },
];

/** Fig. 01 — the studio's thesis as an interactive schematic. */
export function SystemFlow({ className }: { className?: string }) {
  const [active, setActive] = useState<number | null>(null);
  return (
    <figure className={cn('relative rounded-2xl border border-line bg-paper/70 p-5 backdrop-blur-sm sm:p-6', className)}>
      <figcaption className="label mb-5 flex items-center justify-between text-muted">
        <span>Rajah 01 — Dari klik kepada sistem</span>
        <span aria-hidden="true" className="text-saga-deep">●</span>
      </figcaption>
      <ol className="relative" onMouseLeave={() => setActive(null)}>
        <span aria-hidden="true" className="absolute bottom-5 left-[0.9rem] top-5 w-px bg-line-strong">
          <span className="absolute -left-[3px] size-[7px] rounded-full bg-saga shadow-[0_0_0_4px_rgb(217_70_31/0.15)] animate-[travel_5.5s_var(--ease-in-out-quart)_infinite]" />
        </span>
        {steps.map((s, i) => (
          <li key={s.t}>
            <div
              tabIndex={0}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              className={cn('relative flex gap-4 rounded-lg py-2.5 pr-2 outline-offset-0 transition-colors duration-300', active === i && 'bg-paper-2')}
            >
              <span
                className={cn(
                  'label relative z-10 grid size-[1.8rem] shrink-0 place-items-center rounded-full border bg-paper !tracking-normal transition-colors duration-300',
                  active === i ? 'border-saga bg-saga text-paper' : 'border-line-strong text-ink-soft',
                )}
              >
                {i + 1}
              </span>
              <span className="min-w-0">
                <span className="block font-display text-[1.05rem] font-semibold leading-tight tracking-[-0.015em]">{s.t}</span>
                <span className={cn('block text-sm leading-snug transition-colors duration-300', active === i ? 'text-ink-soft' : 'text-muted')}>{s.d}</span>
              </span>
            </div>
          </li>
        ))}
      </ol>
    </figure>
  );
}
