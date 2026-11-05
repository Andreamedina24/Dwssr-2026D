// Funcion para manejar errores en la aplicacion
import createError from 'http-errors';
// Importar el framework express
import express from 'express';
// Importa modulos para manejar rutas
import path, { dirname } from 'node:path';
// Importa modulos para manejar cookies
import cookieParser from 'cookie-parser';
// Importa modulos para manejar logs
import morgan from 'morgan';
// Importando biblioteca de debug
//import createDebug from 'debug';
// Imports para crear Dirname
import { fileURLToPath } from 'node:url';
// Importando el template engine Handlebars
import hbs from 'hbs';

// Importar las rutas de la aplicacion
// eslint-disable-next-line import-x/no-rename-default
import indexRouter from '#routes/index.js';
// eslint-disable-next-line import-x/no-rename-default
import usersRouter from '#routes/users.js';
// Importando el registrador del helper
import { registrarViteHelper } from './lib/vite.js';
// Importando la configuracion de winston logger
 
import logger from './lib/winston.js';

// Creacion del objeto Debug
//const debug = createDebug('dwssr-2026b:server');
// Creando la variables de rutas
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Crear la aplicacion express
//debug('🔨 Creando backend');
logger.info('🔨 Creando backend');
const app = express();

// Configurar el motor de vistas con hbs
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Registro Helper
registrarViteHelper(hbs);

// ==========================================
// INTEGRACIÓN VITE COMO MIDDLEWARE
// ==========================================
if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line import-x/no-extraneous-dependencies
  const { createServer } = await import('vite');
  const viteDevServer = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });
  app.use(viteDevServer.middlewares);
}
// ==========================================

// Configurar middlewares de la aplicacion
app.use(
  morgan('dev', {
    stream: {
      write: (msg) => logger.info(msg.trim()),
    },
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Archivos estaticos para produccion
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'dist')));
}

// Configurar la carpeta de archivos estaticos
//debug('🔨 Creando servidor de Archivos Estáticos');
logger.info('🔨 Creando servidor de Archivos Estáticos');
app.use(express.static(path.join(__dirname, '..', 'public')));

// Registramos las rutas de la aplicacion
//debug('🛣️ Registrando rutas');
logger.info('🛣️ Registrando rutas');
app.use('/', indexRouter);
app.use('/users', usersRouter);

// Capturamos errores 404 y los enviamos al manejador de errores
app.use((req, res, next) => {
  next(createError(404));
});

// Manejador de errores
app.use((err, req, res, _next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

export default app;