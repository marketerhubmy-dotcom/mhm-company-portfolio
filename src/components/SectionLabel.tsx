import { cn } from '@/utils/cn';

export function SectionLabel({ n, children, dark, className }: { n?: string; children: string; dark?: boolean; className?: string }) {
  return (
    <p className={cn('label flex items-center gap-3', dark ? 'text-muted-dark' : 'text-muted', className)}>
      {n && <span className={dark ? 'text-brand-bright' : 'text-brand-deep'}>§{n}</span>}
      <span aria-hidden="true" className={cn('h-px w-8', dark ? 'bg-line-dark' : 'bg-line-strong')} />
      <span>{children}</span>
    </p>
  );
}
