-- =====================================================================
-- 0005_rls_policies.sql
-- Row Level Security:
--   * Lectura pública (anon + authenticated)  -> el sitio público podrá
--     consumir el contenido en el futuro.
--   * Escritura (insert/update/delete) SOLO usuarios autenticados.
-- Idempotente: se recrean las policies con drop if exists.
-- =====================================================================

alter table cafetero.categorias enable row level security;
alter table cafetero.cafes      enable row level security;
alter table cafetero.equipos    enable row level security;

-- ---------------------- CATEGORIAS ----------------------
drop policy if exists categorias_select_all   on cafetero.categorias;
drop policy if exists categorias_write_auth    on cafetero.categorias;

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
drop policy if exists cafes_write_auth  on cafetero.cafes;

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
drop policy if exists equipos_write_auth  on cafetero.equipos;

create policy equipos_select_all
  on cafetero.equipos for select
  to anon, authenticated
  using (true);

create policy equipos_write_auth
  on cafetero.equipos for all
  to authenticated
  using (true)
  with check (true);
