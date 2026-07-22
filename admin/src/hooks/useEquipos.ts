import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  listEquipos,
  createEquipo,
  updateEquipo,
  deleteEquipo,
  type EquipoFilters,
} from '../services/equipos.service';
import { removeImage } from '../services/storage.service';
import type { EquipoInput } from '../types/equipo';

export const equiposKeys = {
  all: ['equipos'] as const,
  list: (filters: EquipoFilters) => ['equipos', 'list', filters] as const,
};

export function useEquipos(filters: EquipoFilters) {
  return useQuery({
    queryKey: equiposKeys.list(filters),
    queryFn: () => listEquipos(filters),
    placeholderData: keepPreviousData,
  });
}

function invalidate(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: equiposKeys.all });
  qc.invalidateQueries({ queryKey: ['stats'] });
  qc.invalidateQueries({ queryKey: ['recent'] });
}

export function useCreateEquipo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: EquipoInput) => createEquipo(input),
    onSuccess: () => invalidate(qc),
  });
}

export function useUpdateEquipo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { id: string; input: EquipoInput }) => updateEquipo(vars.id, vars.input),
    onSuccess: () => invalidate(qc),
  });
}

export function useDeleteEquipo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { id: string; imagen: string | null }) => {
      await deleteEquipo(vars.id);
      await removeImage(vars.imagen);
    },
    onSuccess: () => invalidate(qc),
  });
}
