import { supabase } from '../lib/supabase';

/**
 * Verifica si un usuario (por su id de auth.users) está registrado como
 * administrador activo en cafetero.administradores.
 *
 * Devuelve false ante cualquier error o si no existe la fila, de modo que
 * "sin registro" = "sin acceso".
 */
export async function isUserAdmin(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('administradores')
    .select('id')
    .eq('id', userId)
    .eq('activo', true)
    .maybeSingle();

  if (error) return false;
  return data !== null;
}
