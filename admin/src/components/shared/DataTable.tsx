import type { ReactNode } from 'react';
import type { TableColumn } from '../../types/common';
import { LoadingBlock } from '../ui/Spinner';
import { cn } from '../../lib/cn';

interface DataTableProps<T> {
  columns: TableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  loading?: boolean;
  empty?: ReactNode;
  actions?: (row: T) => ReactNode;
}

export function DataTable<T>({ columns, rows, rowKey, loading, empty, actions }: DataTableProps<T>) {
  if (loading) return <LoadingBlock />;
  if (rows.length === 0 && empty) return <>{empty}</>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[680px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-black/5 text-left text-xs uppercase tracking-wide text-ink-soft">
            {columns.map((c) => (
              <th key={c.key} className={cn('px-4 py-3 font-semibold', c.className)}>
                {c.header}
              </th>
            ))}
            {actions && <th className="px-4 py-3 text-right font-semibold">Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)} className="border-b border-black/5 transition hover:bg-cream/60">
              {columns.map((c) => (
                <td key={c.key} className={cn('px-4 py-3 align-middle', c.className)}>
                  {c.render(row)}
                </td>
              ))}
              {actions && <td className="px-4 py-3 text-right">{actions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
