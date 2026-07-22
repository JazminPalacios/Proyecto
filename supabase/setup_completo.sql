-- =====================================================================
-- setup_completo.sql
-- Script único con TODAS las migraciones (0001 a 0006) en orden.
-- Pegar y ejecutar en: Supabase Dashboard -> SQL Editor -> New query.
--
-- Es idempotente: se puede correr varias veces sin romper nada.
-- NO toca el schema `public`.
-- =====================================================================


-- =====================================================================
-- 1) SCHEMA, TIPOS, FUNCIÓN Y PERMISOS BASE
-- =====================================================================

create extension if not exists pgcrypto;

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

-- Permisos base para exponer el schema vía la API (PostgREST).
grant usage on schema cafetero to anon, authenticated, service_role;

alter default privileges in schema cafetero
  grant select on tables to anon;
alter default privileges in schema cafetero
  grant select, insert, update, delete on tables to authenticated, service_role;


-- =====================================================================
-- 2) TABLA: categorias
-- =====================================================================

create table if not exists cafetero.categorias (
  id          uuid primary key default gen_random_uuid(),
  nombre      text not null,
  tipo        cafetero.categoria_tipo not null,
  created_at  timestamptz not null default now(),

  constraint categorias_nombre_no_vacio check (length(trim(nombre)) > 0),
  constraint categorias_nombre_tipo_unico unique (tipo, nombre)
);

create index if not exists idx_categorias_tipo on cafetero.categorias (tipo);
create index if not exists idx_categorias_created_at on cafetero.categorias (created_at desc);

grant select on cafetero.categorias to anon;
grant select, insert, update, delete on cafetero.categorias to authenticated, service_role;


-- =====================================================================
-- 3) TABLA: cafes
-- =====================================================================

create table if not exists cafetero.cafes (
  id            uuid primary key default gen_random_uuid(),
  nombre        text not null,
  descripcion   text,
  origen        text,
  region        text,
  proceso       text,
  altitud       text,            -- p.ej. "1.800 msnm"
  variedad      text,
  notas         text,            -- notas de cata
  precio        numeric(12,2) not null default 0,
  imagen        text,            -- URL pública en Storage
  categoria_id  uuid,
  disponible    boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  constraint cafes_nombre_no_vacio check (length(trim(nombre)) > 0),
  constraint cafes_precio_no_negativo check (precio >= 0),
  constraint cafes_categoria_fk
    foreign key (categoria_id)
    references cafetero.categorias (id)
    on update cascade
    on delete set null
);

create index if not exists idx_cafes_categoria    on cafetero.cafes (categoria_id);
create index if not exists idx_cafes_disponible   on cafetero.cafes (disponible);
create index if not exists idx_cafes_created_at   on cafetero.cafes (created_at desc);
create index if not exists idx_cafes_nombre_lower on cafetero.cafes (lower(nombre));

create or replace trigger trg_cafes_updated_at
  before update on cafetero.cafes
  for each row execute function cafetero.set_updated_at();

grant select on cafetero.cafes to anon;
grant select, insert, update, delete on cafetero.cafes to authenticated, service_role;


-- =====================================================================
-- 4) TABLA: equipos
-- =====================================================================

create table if not exists cafetero.equipos (
  id            uuid primary key default gen_random_uuid(),
  nombre        text not null,
  descripcion   text,
  marca         text,
  precio        numeric(12,2) not null default 0,
  imagen        text,            -- URL pública en Storage
  categoria_id  uuid,
  disponible    boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  constraint equipos_nombre_no_vacio check (length(trim(nombre)) > 0),
  constraint equipos_precio_no_negativo check (precio >= 0),
  constraint equipos_categoria_fk
    foreign key (categoria_id)
    references cafetero.categorias (id)
    on update cascade
    on delete set null
);

create index if not exists idx_equipos_categoria    on cafetero.equipos (categoria_id);
create index if not exists idx_equipos_disponible   on cafetero.equipos (disponible);
create index if not exists idx_equipos_created_at   on cafetero.equipos (created_at desc);
create index if not exists idx_equipos_nombre_lower on cafetero.equipos (lower(nombre));

create or replace trigger trg_equipos_updated_at
  before update on cafetero.equipos
  for each row execute function cafetero.set_updated_at();

grant select on cafetero.equipos to anon;
grant select, insert, update, delete on cafetero.equipos to authenticated, service_role;


-- =====================================================================
-- 5) ROW LEVEL SECURITY
--    Lectura pública / escritura solo usuarios autenticados.
-- =====================================================================

alter table cafetero.categorias enable row level security;
alter table cafetero.cafes      enable row level security;
alter table cafetero.equipos    enable row level security;

-- ---------------------- CATEGORIAS ----------------------
drop policy if exists categorias_select_all on cafetero.categorias;
drop policy if exists categorias_write_auth on cafetero.categorias;

create policy categorias_select_all
  on cafetero.categorias for select
  to anon, authenticated
  using (true);

create policy categorias_write_auth
  on cafetero.categorias for all
  to authenticated
  using (true)
  with check (true);

-- ------------------------- CAFES ------------------------
drop policy if exists cafes_select_all on cafetero.cafes;
drop policy if exists cafes_write_auth on cafetero.cafes;

create policy cafes_select_all
  on cafetero.cafes for select
  to anon, authenticated
  using (true);

create policy cafes_write_auth
  on cafetero.cafes for all
  to authenticated
  using (true)
  with check (true);

-- ------------------------ EQUIPOS -----------------------
drop policy if exists equipos_select_all on cafetero.equipos;
drop policy if exists equipos_write_auth on cafetero.equipos;

create policy equipos_select_all
  on cafetero.equipos for select
  to anon, authenticated
  using (true);

create policy equipos_write_auth
  on cafetero.equipos for all
  to authenticated
  using (true)
  with check (true);


-- =====================================================================
-- 6) STORAGE: bucket de imágenes + policies
--    Si esta sección da "must be owner of table objects", ejecutá el
--    resto igual y creá el bucket a mano desde Dashboard -> Storage
--    (nombre: imagenes, marcado como Public).
-- =====================================================================

insert into storage.buckets (id, name, public)
values ('imagenes', 'imagenes', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists imagenes_public_read on storage.objects;
create policy imagenes_public_read
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'imagenes');

drop policy if exists imagenes_auth_insert on storage.objects;
create policy imagenes_auth_insert
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'imagenes');

drop policy if exists imagenes_auth_update on storage.objects;
create policy imagenes_auth_update
  on storage.objects for update
  to authenticated
  using (bucket_id = 'imagenes')
  with check (bucket_id = 'imagenes');

drop policy if exists imagenes_auth_delete on storage.objects;
create policy imagenes_auth_delete
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'imagenes');


-- =====================================================================
-- 7) VERIFICACIÓN (opcional)
--    Debe devolver 3 filas: cafes, categorias, equipos.
-- =====================================================================

select table_name
from information_schema.tables
where table_schema = 'cafetero'
order by table_name;
