import { Coffee, PackageOpen, Tags, type LucideIcon } from 'lucide-react';
import { useStats, useRecent } from '../hooks/useDashboard';
import { PageHeader } from '../components/shared/PageHeader';
import { DataTable } from '../components/shared/DataTable';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { Spinner } from '../components/ui/Spinner';
import { formatPrice, formatDate } from '../lib/format';
import { TIPO_LABEL } from '../lib/constants';
import type { TableColumn } from '../types/common';
import type { RecentRow } from '../services/stats.service';

interface StatCardData {
  label: string;
  value: number | undefined;
  icon: LucideIcon;
  tone: string;
}

export function DashboardPage() {
  const stats = useStats();
  const recent = useRecent();

  const cards: StatCardData[] = [
    { label: 'Total de cafés', value: stats.data?.cafes, icon: Coffee, tone: 'bg-brand/10 text-brand' },
    { label: 'Total de equipos', value: stats.data?.equipos, icon: PackageOpen, tone: 'bg-amber-100 text-amber-700' },
    { label: 'Total de categorías', value: stats.data?.categorias, icon: Tags, tone: 'bg-emerald-100 text-emerald-700' },
  ];

  const columns: TableColumn<RecentRow>[] = [
    {
      key: 'nombre',
      header: 'Nombre',
      render: (r) => <span className="font-medium text-ink">{r.nombre}</span>,
    },
    {
      key: 'tipo',
      header: 'Tipo',
      render: (r) => (
        <Badge tone={r.tipo === 'CAFE' ? 'brand' : 'neutral'}>{TIPO_LABEL[r.tipo]}</Badge>
      ),
    },
    {
      key: 'precio',
      header: 'Precio',
      render: (r) => <span className="text-ink">{formatPrice(r.precio)}</span>,
    },
    {
      key: 'created_at',
      header: 'Fecha',
      render: (r) => <span className="text-ink-soft">{formatDate(r.created_at)}</span>,
    },
  ];

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Resumen general del contenido" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="card flex items-center gap-4 p-5">
            <div className={`grid h-12 w-12 place-items-center rounded-xl ${c.tone}`}>
              <c.icon size={22} />
            </div>
            <div>
              <p className="text-sm text-ink-soft">{c.label}</p>
              <p className="font-display text-2xl font-semibold text-ink">
                {stats.isLoading ? <Spinner size={18} /> : (c.value ?? 0)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="card mt-6">
        <div className="border-b border-black/5 px-5 py-4">
          <h2 className="font-display text-lg font-semibold text-ink">Últimos registros</h2>
          <p className="text-sm text-ink-soft">Cafés y equipos agregados recientemente</p>
        </div>
        <DataTable
          columns={columns}
          rows={recent.data ?? []}
          rowKey={(r) => `${r.tipo}-${r.id}`}
          loading={recent.isLoading}
          empty={<EmptyState title="Sin registros todavía" description="Cuando agregues cafés o equipos aparecerán acá." />}
        />
      </div>
    </>
  );
}
