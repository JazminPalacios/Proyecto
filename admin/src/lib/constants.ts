import type { CategoriaTipo } from '../types/categoria';

export const PAGE_SIZE = 8;

export const TIPOS: { value: CategoriaTipo; label: string }[] = [
  { value: 'CAFE', label: 'Café' },
  { value: 'EQUIPO', label: 'Equipo' },
];

export const TIPO_LABEL: Record<CategoriaTipo, string> = {
  CAFE: 'Café',
  EQUIPO: 'Equipo',
};

/** Rutas del panel (se combinan con el basename /admin). */
export const ROUTES = {
  login: '/login',
  dashboard: '/',
  cafes: '/cafes',
  equipos: '/equipos',
  categorias: '/categorias',
} as const;
