export type CategoriaTipo = 'CAFE' | 'EQUIPO';

export interface Categoria {
  id: string;
  nombre: string;
  tipo: CategoriaTipo;
  created_at: string;
}

export interface CategoriaInput {
  nombre: string;
  tipo: CategoriaTipo;
}
