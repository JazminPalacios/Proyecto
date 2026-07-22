# Base de datos — Entre Amigos (schema `cafetero`)

Migraciones SQL para el panel de administración. **No usan el schema `public`.**
Todo vive en el schema `cafetero`.

## Cómo aplicar

### Opción A — SQL Editor (recomendada, sin exponer contraseñas)
1. Entrá a **Supabase → SQL Editor**.
2. Ejecutá los archivos **en orden**:
   1. `migrations/0001_schema_cafetero.sql`
   2. `migrations/0002_categorias.sql`
   3. `migrations/0003_cafes.sql`
   4. `migrations/0004_equipos.sql`
   5. `migrations/0005_rls_policies.sql`
   6. `migrations/0006_storage.sql`

### Opción B — Supabase CLI
```bash
supabase link --project-ref vyxsdxklwfdgudrdpnaq
supabase db push
```

## Paso obligatorio: exponer el schema a la API
Para que `supabase-js` pueda consultar `cafetero.*`:

**Dashboard → Project Settings → API → Data API → Exposed schemas** → agregá `cafetero`.

Luego, en el cliente:
```ts
createClient(url, anonKey, { db: { schema: 'cafetero' } })
```

## Modelo de datos

```
cafetero.categoria_tipo  (enum: 'CAFE' | 'EQUIPO')

cafetero.categorias
  id uuid PK · nombre text · tipo categoria_tipo · created_at
  UNIQUE(tipo, nombre)

cafetero.cafes
  id uuid PK · nombre · descripcion · origen · region · proceso · altitud ·
  variedad · notas · precio numeric(12,2) · imagen(url) · categoria_id FK ·
  disponible bool · created_at · updated_at
  FK categoria_id -> categorias(id) ON DELETE SET NULL

cafetero.equipos
  id uuid PK · nombre · descripcion · marca · precio numeric(12,2) ·
  imagen(url) · categoria_id FK · disponible bool · created_at · updated_at
  FK categoria_id -> categorias(id) ON DELETE SET NULL
```

## Seguridad (RLS)
- **Lectura**: pública (`anon` + `authenticated`).
- **Escritura** (insert/update/delete): **solo `authenticated`**.
- Storage bucket `imagenes`: lectura pública, escritura solo autenticados.

> La coherencia "café ↔ categoría tipo CAFE" (y equipo ↔ EQUIPO) se valida
> además en la app (Zod + el selector solo muestra categorías del tipo correcto).

## Seguridad de credenciales
- **Rotá la contraseña de la base** si la compartiste en texto plano.
- El frontend usa solo `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` (claves públicas).
- La contraseña de `postgres` **nunca** va al repo ni al frontend.
