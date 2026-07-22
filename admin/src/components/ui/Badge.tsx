import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

type Tone = 'neutral' | 'success' | 'danger' | 'brand';

const TONES: Record<Tone, string> = {
  neutral: 'bg-black/5 text-ink-soft',
  success: 'bg-emerald-100 text-emerald-700',
  danger: 'bg-red-100 text-red-700',
  brand: 'bg-brand/10 text-brand',
};

export function Badge({
  tone = 'neutral',
  children,
  className,
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        TONES[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
