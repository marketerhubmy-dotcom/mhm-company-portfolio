import { STATUS_LABEL, type ProjectStatus } from '@/features/portfolio/schema';
import { cn } from '@/utils/cn';

const tone: Record<ProjectStatus, string> = {
  production: 'text-signal border-signal/35 [--dot:var(--color-signal)]',
  demo: 'text-amber border-amber/35 [--dot:var(--color-amber)]',
  prototype: 'text-slate border-slate/35 [--dot:var(--color-slate)]',
  'in-development': 'text-slate border-slate/35 [--dot:var(--color-slate)]',
};
const toneDark: Record<ProjectStatus, string> = {
  production: 'text-[#7fd3a1] border-[#7fd3a1]/35 [--dot:#7fd3a1]',
  demo: 'text-[#f0bd62] border-[#f0bd62]/35 [--dot:#f0bd62]',
  prototype: 'text-[#aebccb] border-[#aebccb]/35 [--dot:#aebccb]',
  'in-development': 'text-[#aebccb] border-[#aebccb]/35 [--dot:#aebccb]',
};

export function StatusBadge({ status, dark, className }: { status: ProjectStatus; dark?: boolean; className?: string }) {
  return (
    <span className={cn('label inline-flex items-center gap-2 rounded-full border px-2.5 py-1 !tracking-[0.08em]', (dark ? toneDark : tone)[status], className)}>
      <span aria-hidden="true" className={cn('size-1.5 rounded-full bg-[var(--dot)]', status === 'production' && 'animate-[pulse-ring_1.8s_ease-out_infinite]')} />
      {STATUS_LABEL[status]}
    </span>
  );
}
