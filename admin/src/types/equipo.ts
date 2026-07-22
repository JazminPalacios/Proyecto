export interface Equipo {
  id: string;
  nombre: string;
  descripcion: string | null;
  marca: string | null;
  precio: number;
  imagen: string | null;
  categoria_id: string | null;
  disponible: boolean;
  created_at: string;
  updated_at: string;
}

export interface EquipoInput {
  nombre: string;
  descripcion: string | null;
  marca: string | null;
  precio: number;
  imagen: string | null;
  categoria_id: string | null;
  disponible: boolean;
}
