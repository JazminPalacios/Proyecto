# Panel de administración — Entre Amigos

SPA en **Vite + React + TypeScript** para gestionar cafés, equipos y categorías.
El **sitio público** (HTML estático en la raíz del repo) no se modifica: esta app es
independiente y vive bajo la ruta `/admin`.

## Stack
- Vite + React 18 + TypeScript (strict)
- React Router 6 (rutas `/admin/*`)
- Supabase JS (auth + PostgreSQL schema `cafetero` + Storage)
- TanStack Query 5 (data fetching / cache)
- React Hook Form + Zod (formularios y validación)
- Tailwind CSS (paleta del sitio público) + lucide-react

## Requisitos previos
1. **Node.js 18+** instalado.
2. Base de datos aplicada: correr las migraciones de `../supabase/migrations`
   (ver `../supabase/README.md`) y **exponer el schema `cafetero`** en
   Dashboard → Settings → API → Exposed schemas.
3. Crear un **usuario administrador** en Supabase → Authentication → Users → *Add user*
   (email + password). No hay registro público: el acceso es solo para admins.

## Configuración
```bash
cd admin
cp .env.example .env    # completá VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY
npm install
```

## Scripts
```bash
npm run dev         # desarrollo → http://localhost:5173/admin/login
npm run typecheck   # tsc --noEmit
npm run lint        # ESLint (0 warnings)
npm run build       # typecheck + build de producción (genera dist/)
npm run preview     # sirve el build localmente
```

## Rutas
| Ruta               | Descripción                         | Protegida |
|--------------------|-------------------------------------|-----------|
| `/admin/login`     | Inicio de sesión                    | No        |
| `/admin`           | Dashboard (stats + últimos)         | Sí        |
| `/admin/cafes`     | CRUD de cafés                       | Sí        |
| `/admin/equipos`   | CRUD de equipos                     | Sí        |
| `/admin/categorias`| CRUD de categorías                  | Sí        |

Cualquier `/admin/*` sin sesión redirige a `/admin/login`.

## Deploy en Vercel

### Opción A — Proyecto separado (recomendada)
Crear un nuevo proyecto de Vercel apuntando a la carpeta `admin`:
- **Root Directory**: `admin`
- **Framework Preset**: Vite
- **Environment Variables**: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- Agregar un rewrite SPA (archivo `admin/vercel.json`, ya incluido).

Servido bajo `/admin` (por el `base` de Vite). Si preferís servirlo en la raíz del
dominio del panel, cambiá `base: '/'` en `vite.config.ts` (el `basename` del router
se ajusta solo, porque se deriva de `import.meta.env.BASE_URL`).

### Opción B — Integrado con el sitio público
Mantener el proyecto actual para el sitio estático y montar el build del panel bajo
`/admin` (copiando `admin/dist` a `/admin` en el paso de build). El `base: '/admin/'`
ya deja las URLs y assets correctos.

## Seguridad
- Rutas `/admin/*` protegidas con `ProtectedRoute` (valida sesión de Supabase).
- RLS en la base: escritura solo para usuarios autenticados.
- La `anon key` es pública/publicable; aun así se mantiene en `.env` (gitignored).
- La contraseña de la base de datos **nunca** se usa en el frontend.
