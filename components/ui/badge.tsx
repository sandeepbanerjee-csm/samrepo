import { cn } from '@/lib/utils';

export function Badge({ label, tone = 'slate' }: { label: string; tone?: 'green' | 'yellow' | 'red' | 'blue' | 'slate' }) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold',
        tone === 'green' && 'bg-emerald-100 text-emerald-700',
        tone === 'yellow' && 'bg-amber-100 text-amber-700',
        tone === 'red' && 'bg-red-100 text-red-700',
        tone === 'blue' && 'bg-blue-100 text-blue-700',
        tone === 'slate' && 'bg-slate-100 text-slate-700'
      )}
    >
      {label}
    </span>
  );
}
