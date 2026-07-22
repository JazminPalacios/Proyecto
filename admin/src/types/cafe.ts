export interface Cafe {
  id: string;
  nombre: string;
  descripcion: string | null;
  origen: string | null;
  region: string | null;
  proceso: string | null;
  altitud: string | null;
  variedad: string | null;
  notas: string | null;
  precio: number;
  imagen: string | null;
  categoria_id: string | null;
  disponible: boolean;
  created_at: string;
  updated_at: string;
}

export interface CafeInput {
  nombre: string;
  descripcion: string | null;
  origen: string | null;
  region: string | null;
  proceso: string | null;
  altitud: string | null;
  variedad: string | null;
  notas: string | null;
  precio: number;
  imagen: string | null;
  categoria_id: string | null;
  disponible: boolean;
}
