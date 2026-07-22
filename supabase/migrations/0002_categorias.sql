-- =====================================================================
-- 0002_categorias.sql
-- Tabla de categorías compartida por Cafés y Equipos.
-- =====================================================================

create table if not exists cafetero.categorias (
  id          uuid primary key default gen_random_uuid(),
  nombre      text not null,
  tipo        cafetero.categoria_tipo not null,
  created_at  timestamptz not null default now(),

  constraint categorias_nombre_no_vacio check (length(trim(nombre)) > 0),
  -- No repetir el mismo nombre dentro del mismo tipo.
  constraint categorias_nombre_tipo_unico unique (tipo, nombre)
);

-- Índice para filtrar por tipo (CAFE / EQUIPO).
create index if not exists idx_categorias_tipo on cafetero.categorias (tipo);
create index if not exists idx_categorias_created_at on cafetero.categorias (created_at desc);

grant select on cafetero.categorias to anon;
grant select, insert, update, delete on cafetero.categorias to authenticated, service_role;
