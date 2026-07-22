import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  listCategorias,
  createCategoria,
  updateCategoria,
  deleteCategoria,
  type CategoriaFilters,
} from '../services/categorias.service';
import type { CategoriaInput } from '../types/categoria';

export const categoriasKeys = {
  all: ['categorias'] as const,
  list: (filters: CategoriaFilters) => ['categorias', 'list', filters] as const,
};

export function useCategorias(filters: CategoriaFilters = {}) {
  return useQuery({
    queryKey: categoriasKeys.list(filters),
    queryFn: () => listCategorias(filters),
  });
}

export function useCreateCategoria() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CategoriaInput) => createCategoria(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: categoriasKeys.all });
      qc.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}

export function useUpdateCategoria() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { id: string; input: CategoriaInput }) =>
      updateCategoria(vars.id, vars.input),
    onSuccess: () => qc.invalidateQueries({ queryKey: categoriasKeys.all }),
  });
}

export function useDeleteCategoria() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCategoria(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: categoriasKeys.all });
      qc.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}
