import { useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, PackageOpen } from 'lucide-react';
import { PageHeader } from '../../components/shared/PageHeader';
import { SearchBar } from '../../components/shared/SearchBar';
import { DataTable } from '../../components/shared/DataTable';
import { Pagination } from '../../components/shared/Pagination';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { EquipoFormModal } from './EquipoFormModal';
import { useEquipos, useDeleteEquipo } from '../../hooks/useEquipos';
import { useCategorias } from '../../hooks/useCategorias';
import { useDebounce } from '../../hooks/useDebounce';
import { useToast } from '../../hooks/useToast';
import { formatPrice, formatDate, getErrorMessage } from '../../lib/format';
import { PAGE_SIZE } from '../../lib/constants';
import type { Equipo } from '../../types/equipo';
import type { TableColumn } from '../../types/common';

export function EquiposPage() {
  const [search, setSearch] = useState('');
  const [categoriaId, setCategoriaId] = useState<string | 'ALL'>('ALL');
  const [disponible, setDisponible] = useState<'ALL' | 'true' | 'false'>('ALL');
  const [page, setPage] = useState(1);
  const debounced = useDebounce(search);

  const { data, isLoading } = useEquipos({
    search: debounced,
    categoriaId,
    disponible,
    page,
    pageSize: PAGE_SIZE,
  });
  const categorias = useCategorias({ tipo: 'EQUIPO' });
  const del = useDeleteEquipo();
  const toast = useToast();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Equipo | null>(null);
  const [toDelete, setToDelete] = useState<Equipo | null>(null);

  const catName = useMemo(() => {
    const map = new Map((categorias.data ?? []).map((c) => [c.id, c.nombre]));
    return (id: string | null) => (id ? map.get(id) ?? '—' : '—');
  }, [categorias.data]);

  const columns: TableColumn<Equipo>[] = useMemo(
    () => [
      {
        key: 'imagen',
        header: '',
        className: 'w-16',
        render: (r) =>
          r.imagen ? (
            <img src={r.imagen} alt={r.nombre} className="h-11 w-11 rounded-lg object-cover" />
          ) : (
            <div className="grid h-11 w-11 place-items-center rounded-lg bg-cream text-ink-soft/40">
              <PackageOpen size={18} />
            </div>
          ),
      },
      {
        key: 'nombre',
        header: 'Nombre',
        render: (r) => (
          <div>
            <p className="font-medium text-ink">{r.nombre}</p>
            {r.marca && <p className="text-xs text-ink-soft">{r.marca}</p>}
          </div>
        ),
      },
      {
        key: 'categoria',
        header: 'Categoría',
        render: (r) => <span className="text-ink-soft">{catName(r.categoria_id)}</span>,
      },
      {
        key: 'precio',
        header: 'Precio',
        render: (r) => <span className="font-medium text-ink">{formatPrice(r.precio)}</span>,
      },
      {
        key: 'disponible',
        header: 'Estado',
        render: (r) =>
          r.disponible ? (
            <Badge tone="success">Disponible</Badge>
          ) : (
            <Badge tone="danger">No disponible</Badge>
          ),
      },
      {
        key: 'created_at',
        header: 'Creado',
        render: (r) => <span className="text-ink-soft">{formatDate(r.created_at)}</span>,
      },
    ],
    [catName]
  );

  const handleDelete = async () => {
    if (!toDelete) return;
    try {
      await del.mutateAsync({ id: toDelete.id, imagen: toDelete.imagen });
      toast.success('Equipo eliminado');
      setToDelete(null);
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  };

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const rows = data?.rows ?? [];
  const total = data?.count ?? 0;

  return (
    <>
      <PageHeader
        title="Equipos"
        subtitle="Gestioná el catálogo de equipos e insumos"
        action={
          <Button onClick={openCreate}>
            <Plus size={18} /> Nuevo equipo
          </Button>
        }
      />

      <div className="card">
        <div className="flex flex-wrap items-center gap-3 p-4">
          <SearchBar
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            placeholder="Buscar equipo…"
          />
          <Select
            value={categoriaId}
            onChange={(e) => {
              setCategoriaId(e.target.value);
              setPage(1);
            }}
            className="w-auto"
          >
            <option value="ALL">Todas las categorías</option>
            {(categorias.data ?? []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </Select>
          <Select
            value={disponible}
            onChange={(e) => {
              setDisponible(e.target.value as 'ALL' | 'true' | 'false');
              setPage(1);
            }}
            className="w-auto"
          >
            <option value="ALL">Todos</option>
            <option value="true">Disponibles</option>
            <option value="false">No disponibles</option>
          </Select>
        </div>

        <DataTable
          columns={columns}
          rows={rows}
          rowKey={(r) => r.id}
          loading={isLoading}
          empty={
            <EmptyState
              icon={PackageOpen}
              title="Sin equipos"
              description="Agregá tu primer equipo o insumo."
              action={
                <Button onClick={openCreate}>
                  <Plus size={18} /> Nuevo equipo
                </Button>
              }
            />
          }
          actions={(r) => (
            <div className="flex justify-end gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditing(r);
                  setFormOpen(true);
                }}
                aria-label="Editar"
              >
                <Pencil size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600"
                onClick={() => setToDelete(r)}
                aria-label="Eliminar"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          )}
        />

        {rows.length > 0 && (
          <Pagination page={page} pageSize={PAGE_SIZE} total={total} onChange={setPage} />
        )}
      </div>

      <EquipoFormModal open={formOpen} onClose={() => setFormOpen(false)} record={editing} />
      <ConfirmDialog
        open={Boolean(toDelete)}
        danger
        title="Eliminar equipo"
        message={`¿Eliminar "${toDelete?.nombre}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        loading={del.isPending}
        onConfirm={handleDelete}
        onClose={() => setToDelete(null)}
      />
    </>
  );
}
