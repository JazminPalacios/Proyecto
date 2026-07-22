import { useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, Tags } from 'lucide-react';
import { PageHeader } from '../../components/shared/PageHeader';
import { SearchBar } from '../../components/shared/SearchBar';
import { DataTable } from '../../components/shared/DataTable';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { CategoriaFormModal } from './CategoriaFormModal';
import { useCategorias, useDeleteCategoria } from '../../hooks/useCategorias';
import { useDebounce } from '../../hooks/useDebounce';
import { useToast } from '../../hooks/useToast';
import { formatDate, getErrorMessage } from '../../lib/format';
import { TIPO_LABEL } from '../../lib/constants';
import type { Categoria, CategoriaTipo } from '../../types/categoria';
import type { TableColumn } from '../../types/common';

export function CategoriasPage() {
  const [search, setSearch] = useState('');
  const [tipo, setTipo] = useState<CategoriaTipo | 'ALL'>('ALL');
  const debounced = useDebounce(search);

  const { data, isLoading } = useCategorias({ tipo, search: debounced });
  const del = useDeleteCategoria();
  const toast = useToast();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Categoria | null>(null);
  const [toDelete, setToDelete] = useState<Categoria | null>(null);

  const columns: TableColumn<Categoria>[] = useMemo(
    () => [
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
        key: 'created_at',
        header: 'Creado',
        render: (r) => <span className="text-ink-soft">{formatDate(r.created_at)}</span>,
      },
    ],
    []
  );

  const handleDelete = async () => {
    if (!toDelete) return;
    try {
      await del.mutateAsync(toDelete.id);
      toast.success('Categoría eliminada');
      setToDelete(null);
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  };

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const rows = data ?? [];

  return (
    <>
      <PageHeader
        title="Categorías"
        subtitle="Organizá cafés y equipos por categoría"
        action={
          <Button onClick={openCreate}>
            <Plus size={18} /> Nueva categoría
          </Button>
        }
      />

      <div className="card">
        <div className="flex flex-wrap items-center gap-3 p-4">
          <SearchBar value={search} onChange={setSearch} placeholder="Buscar categoría…" />
          <Select
            value={tipo}
            onChange={(e) => setTipo(e.target.value as CategoriaTipo | 'ALL')}
            className="w-auto"
          >
            <option value="ALL">Todos los tipos</option>
            <option value="CAFE">Café</option>
            <option value="EQUIPO">Equipo</option>
          </Select>
        </div>

        <DataTable
          columns={columns}
          rows={rows}
          rowKey={(r) => r.id}
          loading={isLoading}
          empty={
            <EmptyState
              icon={Tags}
              title="Sin categorías"
              description="Creá tu primera categoría para empezar."
              action={
                <Button onClick={openCreate}>
                  <Plus size={18} /> Nueva categoría
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
      </div>

      <CategoriaFormModal open={formOpen} onClose={() => setFormOpen(false)} record={editing} />
      <ConfirmDialog
        open={Boolean(toDelete)}
        danger
        title="Eliminar categoría"
        message={`¿Eliminar la categoría "${toDelete?.nombre}"? Los cafés o equipos asociados quedarán sin categoría.`}
        confirmLabel="Eliminar"
        loading={del.isPending}
        onConfirm={handleDelete}
        onClose={() => setToDelete(null)}
      />
    </>
  );
}
