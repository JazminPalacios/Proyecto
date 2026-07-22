import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  listCafes,
  createCafe,
  updateCafe,
  deleteCafe,
  type CafeFilters,
} from '../services/cafes.service';
import { removeImage } from '../services/storage.service';
import type { CafeInput } from '../types/cafe';

export const cafesKeys = {
  all: ['cafes'] as const,
  list: (filters: CafeFilters) => ['cafes', 'list', filters] as const,
};

export function useCafes(filters: CafeFilters) {
  return useQuery({
    queryKey: cafesKeys.list(filters),
    queryFn: () => listCafes(filters),
    placeholderData: keepPreviousData,
  });
}

function invalidate(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: cafesKeys.all });
  qc.invalidateQueries({ queryKey: ['stats'] });
  qc.invalidateQueries({ queryKey: ['recent'] });
}

export function useCreateCafe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CafeInput) => createCafe(input),
    onSuccess: () => invalidate(qc),
  });
}

export function useUpdateCafe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { id: string; input: CafeInput }) => updateCafe(vars.id, vars.input),
    onSuccess: () => invalidate(qc),
  });
}

export function useDeleteCafe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { id: string; imagen: string | null }) => {
      await deleteCafe(vars.id);
      await removeImage(vars.imagen);
    },
    onSuccess: () => invalidate(qc),
  });
}
