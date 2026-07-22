-- =====================================================================
-- 0001_schema_cafetero.sql
-- Crea el schema `cafetero`, tipos, función de utilidad y permisos base.
-- Idempotente: se puede correr varias veces sin romper nada existente.
-- NO toca el schema public.
-- =====================================================================

-- Extensión para gen_random_uuid() (disponible en Supabase).
create extension if not exists pgcrypto;

-- Schema propio de la aplicación.
create schema if not exists cafetero;

-- Tipo de categoría (sirve para ambos módulos): CAFE o EQUIPO.
do $$
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where t.typname = 'categoria_tipo' and n.nspname = 'cafetero'
  ) then
    create type cafetero.categoria_tipo as enum ('CAFE', 'EQUIPO');
  end if;
end
$$;

-- Trigger genérico para mantener updated_at.
create or replace function cafetero.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end
$$;

-- ---------------------------------------------------------------------
-- Permisos base para exponer el schema vía la API de Supabase (PostgREST).
-- Además hay que agregar `cafetero` a los "Exposed schemas" en
-- Dashboard → Project Settings → API (ver supabase/README.md).
-- ---------------------------------------------------------------------
grant usage on schema cafetero to anon, authenticated, service_role;

-- Privilegios por defecto para tablas que se creen luego en el schema.
alter default privileges in schema cafetero
  grant select on tables to anon;
alter default privileges in schema cafetero
  grant select, insert, update, delete on tables to authenticated, service_role;
