/** Formatea un precio en guaraníes, igual que el sitio público. */
export function formatPrice(value: number | null | undefined): string {
  return '₲ ' + (value ?? 0).toLocaleString('es-PY');
}

/** Fecha corta legible (es-PY). */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('es-PY', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
}

/** Extrae un mensaje legible de cualquier error (Supabase / Error / string). */
export function getErrorMessage(error: unknown): string {
  if (!error) return 'Ocurrió un error inesperado.';
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  if (typeof error === 'object' && 'message' in error) {
    return String((error as { message: unknown }).message);
  }
  return 'Ocurrió un error inesperado.';
}
