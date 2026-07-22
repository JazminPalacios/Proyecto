-- =====================================================================
-- 0003_cafes.sql
-- Módulo Cafés. La imagen guarda solo la URL de Supabase Storage.
-- categoria_id referencia cafetero.categorias (se espera tipo = 'CAFE',
-- lo cual se valida además en la capa de aplicación con Zod).
-- =====================================================================

create table if not exists cafetero.cafes (
  id            uuid primary key default gen_random_uuid(),
  nombre        text not null,
  descripcion   text,
  origen        text,
  region        text,
  proceso       text,
  altitud       text,            -- p.ej. "1.800 msnm" (texto para flexibilidad)
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

create index if not exists idx_cafes_categoria   on cafetero.cafes (categoria_id);
create index if not exists idx_cafes_disponible  on cafetero.cafes (disponible);
create index if not exists idx_cafes_created_at  on cafetero.cafes (created_at desc);
-- Búsqueda case-insensitive por nombre (suficiente para el volumen esperado).
create index if not exists idx_cafes_nombre_lower on cafetero.cafes (lower(nombre));

create or replace trigger trg_cafes_updated_at
  before update on cafetero.cafes
  for each row execute function cafetero.set_updated_at();

grant select on cafetero.cafes to anon;
grant select, insert, update, delete on cafetero.cafes to authenticated, service_role;
