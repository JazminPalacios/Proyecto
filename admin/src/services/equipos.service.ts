import { supabase } from '../lib/supabase';
import type { Equipo, EquipoInput } from '../types/equipo';
import type { Paginated } from '../types/common';

export interface EquipoFilters {
  search?: string;
  categoriaId?: string | 'ALL';
  disponible?: 'ALL' | 'true' | 'false';
  page: number;
  pageSize: number;
}

export async function listEquipos(filters: EquipoFilters): Promise<Paginated<Equipo>> {
  const from = (filters.page - 1) * filters.pageSize;
  const to = from + filters.pageSize - 1;

  let query = supabase
    .from('equipos')
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
  return { rows: (data ?? []) as Equipo[], count: count ?? 0 };
}

export async function createEquipo(input: EquipoInput): Promise<Equipo> {
  const { data, error } = await supabase.from('equipos').insert(input).select('*').single();
  if (error) throw error;
  return data as Equipo;
}

export async function updateEquipo(id: string, input: EquipoInput): Promise<Equipo> {
  const { data, error } = await supabase
    .from('equipos')
    .update(input)
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return data as Equipo;
}

export async function deleteEquipo(id: string): Promise<void> {
  const { error } = await supabase.from('equipos').delete().eq('id', id);
  if (error) throw error;
}
