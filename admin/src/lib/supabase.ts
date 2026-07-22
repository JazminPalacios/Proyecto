import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error(
    'Faltan VITE_SUPABASE_URL y/o VITE_SUPABASE_ANON_KEY. Copiá .env.example a .env y completá los valores.'
  );
}

/**
 * Cliente Supabase apuntando al schema `cafetero` (no `public`).
 * Recordá exponer el schema en Dashboard → Settings → API → Exposed schemas.
 */
export const supabase = createClient(url, anonKey, {
  db: { schema: 'cafetero' },
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export const STORAGE_BUCKET = 'imagenes';
