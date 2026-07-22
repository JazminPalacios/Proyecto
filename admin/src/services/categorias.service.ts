import { supabase } from '../lib/supabase';
import type { Categoria, CategoriaInput, CategoriaTipo } from '../types/categoria';

export interface CategoriaFilters {
  tipo?: CategoriaTipo | 'ALL';
  search?: string;
}

export async function listCategorias(filters: CategoriaFilters = {}): Promise<Categoria[]> {
  let query = supabase.from('categorias').select('*').order('created_at', { ascending: false });

  if (filters.tipo && filters.tipo !== 'ALL') query = query.eq('tipo', filters.tipo);
  if (filters.search?.trim()) query = query.ilike('nombre', `%${filters.search.trim()}%`);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Categoria[];
}

export async function createCategoria(input: CategoriaInput): Promise<Categoria> {
  const { data, error } = await supabase.from('categorias').insert(input).select('*').single();
  if (error) throw error;
  return data as Categoria;
}

export async function updateCategoria(id: string, input: CategoriaInput): Promise<Categoria> {
  const { data, error } = await supabase
    .from('categorias')
    .update(input)
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return data as Categoria;
}

export async function deleteCategoria(id: string): Promise<void> {
  const { error } = await supabase.from('categorias').delete().eq('id', id);
  if (error) throw error;
}
