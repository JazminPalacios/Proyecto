import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// El panel vive bajo /admin para no chocar con el sitio público.
export default defineConfig({
  base: '/admin/',
  plugins: [react()],
  server: { port: 5173, open: '/admin/login' },
  build: { outDir: 'dist', sourcemap: false },
});
