-- =====================================================================
-- 0007_administradores.sql
-- Tabla de administradores del panel.
--   * Cada fila enlaza 1:1 con un usuario de auth.users (Supabase Auth).
--   * Sirve para gestionar quién tiene acceso al panel, con nombre y rol.
--   * El login lo sigue haciendo Supabase Auth; esta tabla es la capa
--     de perfil/permisos por encima.
-- Idempotente.
-- =====================================================================

-- Rol del administrador (extensible a futuro: EDITOR, etc.).
do $$
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where t.typname = 'admin_rol' and n.nspname = 'cafetero'
  ) then
    create type cafetero.admin_rol as enum ('ADMIN', 'EDITOR');
  end if;
end
$$;

create table if not exists cafetero.administradores (
  -- El id ES el id del usuario en auth.users (relación 1:1).
  id          uuid primary key
                references auth.users (id)
                on delete cascade,
  nombre      text not null,
  email       text not null,
  rol         cafetero.admin_rol not null default 'ADMIN',
  activo      boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),

  constraint administradores_nombre_no_vacio check (length(trim(nombre)) > 0),
  constraint administradores_email_unico unique (email)
);

create index if not exists idx_administradores_activo on cafetero.administradores (activo);

create or replace trigger trg_administradores_updated_at
  before update on cafetero.administradores
  for each row execute function cafetero.set_updated_at();

-- ---------------------------------------------------------------------
-- Permisos: NO exponer la lista de admins al público (anon).
-- Solo usuarios autenticados pueden leer/escribir.
-- (El schema tiene default privileges que otorgan select a anon; se
--  revoca explícitamente para esta tabla.)
-- ---------------------------------------------------------------------
revoke all on cafetero.administradores from anon;
grant select, insert, update, delete on cafetero.administradores to authenticated, service_role;

-- ------------------------------ RLS ----------------------------------
alter table cafetero.administradores enable row level security;

drop policy if exists administradores_select_auth on cafetero.administradores;
drop policy if exists administradores_write_auth  on cafetero.administradores;

create policy administradores_select_auth
  on cafetero.administradores for select
  to authenticated
  using (true);

create policy administradores_write_auth
  on cafetero.administradores for all
  to authenticated
  using (true)
  with check (true);
