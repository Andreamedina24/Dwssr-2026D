// importar biblioteca file stream
import fs from 'node:fs';
// biblioteca de rutas
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// creando las variables de rutas
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * helper para handlebars que genera las etiquetas de vite
 * EN DESARROLLO: conecta al servidor de desarrollo de vite
 * EN PRODUCCIÓN: usa los compilados de vite
 */
export function viteAssets() {
  const isDev = process.env.NODE_ENV !== 'production';
  // Rescatando la url del servidor de desarrollo
  let viteDevServer = process.env.VITE_DEV_SERVER || 'http://localhost:5173';
  if (process.env.CODESPACE_NAME) {
    viteDevServer = `https://${process.env.CODESPACE_NAME}-5173.app.github.dev`;
  }
  // si estamos en modo desarrollo
  if (isDev) {
    return `
        <script type="module" src="${viteDevServer}/@vite/client"></script>
        <script type="module" src="${viteDevServer}/main.js"></script>
        `;
  }

  // en producción leemos el manifest
  const manifestPath = path.join(__dirname, '..', '..', 'dist', '.vite', 'manifest.json');
  
  // si no existe el manifest
  if (!fs.existsSync(manifestPath)) {
    // eslint-disable-next-line no-console
    console.warn("Vite Manifest not found. run 'npm run build'");
    return '';
  }

  // leyendo y parseando a JSON el archivo manifest
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  const mainEntry = manifest['main.js'] || manifest['src/main.js'];
  
  if (!mainEntry) {
    // eslint-disable-next-line no-console
    console.warn('Archivo main.js no está disponible en el manifiesto de vite');
    return '';
  }

  let tags = '';

  // CSS Files
  if (mainEntry.css) {
    mainEntry.css.forEach((cssfiles) => {
      tags += `<link rel="stylesheet" href="/${cssfiles}">\n`;
    });
  }

  // JS Files
  tags += `<script type="module" src="/${mainEntry.file}" defer></script>`;

  return tags;
}

/**
 * Función registradora del Helper de Handlebars
 */
export function registrarViteHelper(hbs) {
  hbs.registerHelper('ViteAssets', () => new hbs.SafeString(viteAssets()));
}