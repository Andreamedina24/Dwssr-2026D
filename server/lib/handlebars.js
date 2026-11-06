import { create as createHbsEngine } from 'express-handlebars';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { registerViteHelper } from './vite.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Exportar la funcion de configuracion
export default function configureHandlebars(app) {
  // Estableciendo la extencion de las vistas en .hbs
  // Y estableciendo el layout principal en main
  const exphbs = createHbsEngine({
    extname: '.hbs',
    defaultLayout: 'main',
  });

  // Registrando el Helper de Vite
  registerViteHelper(exphbs.handlebars);

  // Registrando Handlebars en la APP de Express
  // 1. Registro el engine y su nombre
  app.engine('hbs', exphbs.engine);
  // 2. Registro el engine previamente dado de alta
  app.set('view engine', 'hbs');
  // 3. Establecemos el directorio de vistas
  app.set('views', path.join(__dirname, '..', 'views'));
}