import { supabase } from '../lib/supabase';
import type { Cafe, CafeInput } from '../types/cafe';
import type { Paginated } from '../types/common';

export interface CafeFilters {
  search?: string;
  categoriaId?: string | 'ALL';
  disponible?: 'ALL' | 'true' | 'false';
  page: number;
  pageSize: number;
}

export async function listCafes(filters: CafeFilters): Promise<Paginated<Cafe>> {
  const from = (filters.page - 1) * filters.pageSize;
  const to = from + filters.pageSize - 1;

  let query = supabase
    .from('cafes')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (filters.search?.trim()) query = query.ilike('nombre', `%${filters.search.trim()}%`);
  if (filters.categoriaId && filters.categoriaId !== 'ALL') {
    query = query.eq('categoria_id', filters.categoriaId);
  }
  if (filters.disponible && filters.disponible !== 'ALL') {
    query = query.eq('disponible', filters.disponible === 'true');
  }

  const { data, error, count } = await query;
  if (error) throw error;
  return { rows: (data ?? []) as Cafe[], count: count ?? 0 };
}

export async function createCafe(input: CafeInput): Promise<Cafe> {
  const { data, error } = await supabase.from('cafes').insert(input).select('*').single();
  if (error) throw error;
  return data as Cafe;
}

export async function updateCafe(id: string, input: CafeInput): Promise<Cafe> {
  const { data, error } = await supabase
    .from('cafes')
    .update(input)
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return data as Cafe;
}

export async function deleteCafe(id: string): Promise<void> {
  const { error } = await supabase.from('cafes').delete().eq('id', id);
  if (error) throw error;
}
