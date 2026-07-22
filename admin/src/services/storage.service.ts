import { supabase, STORAGE_BUCKET } from '../lib/supabase';

/**
 * Sube una imagen al bucket y devuelve la URL pública.
 * @param folder subcarpeta lógica dentro del bucket (ej. "cafes" | "equipos")
 */
export async function uploadImage(file: File, folder: string): Promise<string> {
  const ext = file.name.includes('.') ? file.name.split('.').pop() : 'jpg';
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type || undefined,
  });
  if (error) throw error;

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/** Deriva la ruta interna del bucket a partir de una URL pública. */
export function storagePathFromUrl(url: string): string | null {
  const marker = `/object/public/${STORAGE_BUCKET}/`;
  const idx = url.indexOf(marker);
  return idx === -1 ? null : url.slice(idx + marker.length);
}

/** Elimina una imagen del bucket (silencioso si la URL no pertenece al bucket). */
export async function removeImage(url: string | null | undefined): Promise<void> {
  if (!url) return;
  const path = storagePathFromUrl(url);
  if (!path) return;
  await supabase.storage.from(STORAGE_BUCKET).remove([path]);
}
