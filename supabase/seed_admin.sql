-- =====================================================================
-- seed_admin.sql
-- Alta del primer administrador en cafetero.administradores.
--
-- Toma el email (y un nombre tentativo) directamente de auth.users
-- usando el id del usuario. No hay que editar nada: pegar y ejecutar.
--
-- REQUISITO: el usuario con ese id ya existe en Authentication -> Users.
-- =====================================================================

insert into cafetero.administradores (id, nombre, email, rol, activo)
select
  u.id,
  coalesce(
    nullif(trim(u.raw_user_meta_data ->> 'name'), ''),
    nullif(trim(u.raw_user_meta_data ->> 'full_name'), ''),
    split_part(u.email, '@', 1)          -- fallback: parte antes del @
  ) as nombre,
  u.email,
  'ADMIN',
  true
from auth.users u
where u.id = '3167e2af-5710-4497-b921-c5304bc8ff0c'
on conflict (id) do update
  set email  = excluded.email,
      activo = excluded.activo;

-- Verificación: debe mostrar la fila del admin.
select id, nombre, email, rol, activo, created_at
from cafetero.administradores;
