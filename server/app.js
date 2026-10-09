// Funcion para manejar errores
// X var createError = require('http-errors');
import createError from 'http-errors'
// Importa el framework express
// X var express = require('express');
import express from 'express'
// Importa los modulos para manejar rutas
// X var path = require('path');
import path from 'node:path'
// Importa modulos para las cookies
// X var cookieParser = require('cookie-parser');
import cookieParser from 'cookie-parser'
// Importa modulos para manejar logs
//X var logger = require('morgan');
import logger from 'morgan'

//importar rutas de la aplicacion
import indexRouter from '#routes/index.js'
import usersRouter from '#routes/users.js'
//importando el registrador del helper
import createdebug from 'debug'

//importando el registrador del helper
import { registrarViteHelper } from './lib/vite.js'

const debug = createdebug('dwssr-2026d:server');
//imports para crear dirname
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

//importanto el tempplate engine Hadlebars
import hbs from 'hbs'

//creando la variables de rutas
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

debug('Aplicación inicializada correctamente');

//importar las rutas de la aplicacion

//var indexRouter = require('./routes/index');

//var usersRouter = require('./routes/users');


//Crea la aplicacion express
var app = express();

// Configurar el motor de visitas con hbs
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
//registro Helper
registrarViteHelper(hbs)

// Connfigura los miderwares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//archivos estaticos para produccion
if(process.env.NODE_ENV =='production'){
  app.use(express.static(path.join(__dirname,'..' ,'dist')));
}

debug('Carpeta de archivos');
// Configura la carpeta de los archivos estaticos 
app.use(express.static(path.join(__dirname,'..' ,'public')));

debug('Rutas de aplicacion');
//registramos rutas de la aplicacion
app.use('/', indexRouter);
app.use('/users', usersRouter);

// capturamos el error 404
app.use(function(req, res, next) {
  next(createError(404));
});

// Manejador de errores
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;