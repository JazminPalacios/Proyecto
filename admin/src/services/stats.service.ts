import { supabase } from '../lib/supabase';

export interface DashboardStats {
  cafes: number;
  equipos: number;
  categorias: number;
}

export type RecentTipo = 'CAFE' | 'EQUIPO';

export interface RecentRow {
  id: string;
  nombre: string;
  precio: number;
  tipo: RecentTipo;
  created_at: string;
}

async function countRows(table: 'cafes' | 'equipos' | 'categorias'): Promise<number> {
  const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
  if (error) throw error;
  return count ?? 0;
}

export async function getStats(): Promise<DashboardStats> {
  const [cafes, equipos, categorias] = await Promise.all([
    countRows('cafes'),
    countRows('equipos'),
    countRows('categorias'),
  ]);
  return { cafes, equipos, categorias };
}

export async function getRecent(limit = 8): Promise<RecentRow[]> {
  const [cafesRes, equiposRes] = await Promise.all([
    supabase
      .from('cafes')
      .select('id, nombre, precio, created_at')
      .order('created_at', { ascending: false })
      .limit(limit),
    supabase
      .from('equipos')
      .select('id, nombre, precio, created_at')
      .order('created_at', { ascending: false })
      .limit(limit),
  ]);

  if (cafesRes.error) throw cafesRes.error;
  if (equiposRes.error) throw equiposRes.error;

  const cafes: RecentRow[] = (cafesRes.data ?? []).map((r) => ({
    id: r.id as string,
    nombre: r.nombre as string,
    precio: r.precio as number,
    created_at: r.created_at as string,
    tipo: 'CAFE',
  }));
  const equipos: RecentRow[] = (equiposRes.data ?? []).map((r) => ({
    id: r.id as string,
    nombre: r.nombre as string,
    precio: r.precio as number,
    created_at: r.created_at as string,
    tipo: 'EQUIPO',
  }));

  return [...cafes, ...equipos]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit);
}
