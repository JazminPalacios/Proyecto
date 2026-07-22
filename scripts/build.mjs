// =====================================================================
// scripts/build.mjs
// Arma la carpeta `dist/` que Vercel publica:
//   dist/            -> sitio público estático (copiado tal cual)
//   dist/admin/      -> build del panel de administración (Vite)
//
// El panel ya debe estar compilado (admin/dist) antes de correr esto;
// de eso se encarga el script `build` de package.json.
// =====================================================================

import { cp, rm, mkdir, readdir, access } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const salida = join(raiz, 'dist');

// Todo lo que NO forma parte del sitio público servido por Vercel.
const excluir = new Set([
  '.git',
  '.gitignore',
  '.thumbnail',
  '.vercel',
  'README.md',
  'admin',
  'dist',
  'node_modules',
  'package.json',
  'package-lock.json',
  'scripts',
  'supabase',
  'vercel.json',
]);

const existe = async (ruta) => {
  try {
    await access(ruta);
    return true;
  } catch {
    return false;
  }
};

// 1) Partir siempre de una salida limpia.
await rm(salida, { recursive: true, force: true });
await mkdir(salida, { recursive: true });

// 2) Copiar el sitio público (todo lo de la raíz menos las exclusiones).
const entradas = await readdir(raiz, { withFileTypes: true });
const copiados = [];

for (const entrada of entradas) {
  if (excluir.has(entrada.name)) continue;
  await cp(join(raiz, entrada.name), join(salida, entrada.name), { recursive: true });
  copiados.push(entrada.name);
}

console.log(`Sitio público: ${copiados.length} entradas copiadas (${copiados.join(', ')})`);

// 3) Copiar el build del panel bajo /admin.
const adminDist = join(raiz, 'admin', 'dist');

if (!(await existe(adminDist))) {
  console.error(
    'ERROR: no existe admin/dist. Hay que compilar el panel antes:\n' +
      '  npm --prefix admin install && npm --prefix admin run build'
  );
  process.exit(1);
}

await cp(adminDist, join(salida, 'admin'), { recursive: true });
console.log('Panel de administración copiado a dist/admin');

console.log('Build completo. Carpeta de salida: dist/');
