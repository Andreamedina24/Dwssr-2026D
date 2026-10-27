#!/usr/bin/env node

/**
 * Module dependencies.
 */

import http from 'node:http';
// importando debug
import createDebug from 'debug';
import app from '../app.js';

// var debug = require('debug')('dwssr-2026d:server');

// creacion del onjeto debug
const debug = createDebug('dwssr-2026d:server');

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  const parsedPort = parseInt(val, 10);

  if (Number.isNaN(parsedPort)) {
    // named pipe
    return val;
  }

  if (parsedPort >= 0) {
    // port number
    return parsedPort;
  }

  return false;
}

/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? `pipe ${port}`// 'Pipe ' + port
    : `port ${port}`; // 'port' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      // eslint-disable-next-line no-console
      console.error(`${bind} requires ele`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      // eslint-disable-next-line no-console
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? `pipe ${addr}` // pipe + addr
    : `port ${addr.port}`; // port + addr. port
  debug(`💻Listening on ${bind}`);
}

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);