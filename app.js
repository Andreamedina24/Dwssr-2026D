//Funcion para manejar errores en la aplicacion
var createError = require('http-errors');
//Importar el framework express
var express = require('express');
//Importa modulos para manejar rutas
var path = require('path');
//Importa modilos para manejar cookies
var cookieParser = require('cookie-parser');
//Importa modulos para manejar logs
var logger = require('morgan');

//Importar las rutas de la aplicacion
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

//Crear la aplicacion de express
var app = express();

// Configurar el motor de vistas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//Configurar middlewares de la aplicacion
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//Configura la carpeta de los archivos estaticos
app.use(express.static(path.join(__dirname, 'public')));

//Registramos rutas de la aplicacion
app.use('/', indexRouter);
app.use('/users', usersRouter);

// capturamos error 404
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

module.exports = app;
