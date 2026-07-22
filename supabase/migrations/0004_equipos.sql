-- =====================================================================
-- 0004_equipos.sql
-- Módulo Equipos. La imagen guarda solo la URL de Supabase Storage.
-- categoria_id referencia cafetero.categorias (se espera tipo = 'EQUIPO').
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

create index if not exists idx_equipos_categoria   on cafetero.equipos (categoria_id);
create index if not exists idx_equipos_disponible  on cafetero.equipos (disponible);
create index if not exists idx_equipos_created_at  on cafetero.equipos (created_at desc);
create index if not exists idx_equipos_nombre_lower on cafetero.equipos (lower(nombre));

create or replace trigger trg_equipos_updated_at
  before update on cafetero.equipos
  for each row execute function cafetero.set_updated_at();

grant select on cafetero.equipos to anon;
grant select, insert, update, delete on cafetero.equipos to authenticated, service_role;
