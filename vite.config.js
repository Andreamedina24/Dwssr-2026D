// Importando configurador de Vite
import { defineConfig } from 'vite';
// Importando un admin de rutas y node url
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
// Importando tailwindcss
import tailwindcss from '@tailwindcss/vite';

// Creando las variables de rutas (__dirname en ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  // Directorio Raiz de los archivos fuente del front-end
  root: 'src',
  // Agregando a Vite el plugin de tailwindcss
  plugins: [tailwindcss()],
  // Configurando un servidor de desarrollo
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    cors: {
      origin: '*',
      methods: ['GET', 'OPTIONS', 'PATCH', 'DELETE', 'POST', 'PUT'],
    },
    hmr: {
      clientPort: 443,
    },
  },
  // Configurando el Build
  build: {
    // Directorio de salida para produccion
    outDir: '../dist',
    // Asegurando limpieza del folder de produccion
    emptyOutDir: true,
    // Generar manifiesto para el servidor
    manifest: true,
    // Opciones de Empaquetado
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/main.js'),
      },
    },
  },
  publicDir: false,
});