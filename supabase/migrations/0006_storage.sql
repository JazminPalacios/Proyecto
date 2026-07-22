-- =====================================================================
-- 0006_storage.sql
-- Bucket de imágenes + policies de Storage.
--   * Lectura pública.
--   * Subir / actualizar / eliminar SOLO usuarios autenticados.
-- =====================================================================

-- Bucket público para imágenes de cafés y equipos.
insert into storage.buckets (id, name, public)
values ('imagenes', 'imagenes', true)
on conflict (id) do update set public = excluded.public;

-- Policies sobre storage.objects acotadas al bucket 'imagenes'.
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
