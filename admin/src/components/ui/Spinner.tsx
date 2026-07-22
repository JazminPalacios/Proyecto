import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/cn';

export function Spinner({ size = 20, className }: { size?: number; className?: string }) {
  return <Loader2 size={size} className={cn('animate-spin text-brand', className)} />;
}

export function LoadingBlock({ label = 'Cargando…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-ink-soft">
      <Spinner size={28} />
      <span className="text-sm">{label}</span>
    </div>
  );
}
