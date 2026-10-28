// Importamos bibliotecas de node
import path from 'node:path';
import fs from 'node:fs';

import winston, { format } from 'winston';
// Importando plug-in de winston
import DailyRotateFile from 'winston-daily-rotate-file';

// Destructuración utiles de format
const {
  combine, timestamp, label, printf, colorize, prettyPrint,
} = format;

// Creando variable del directorio raiz
const rootDir = path.resolve(process.cwd());

// Creando directorio de Logs
const logsDir = path.join(rootDir, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Defininedo esquema de colores
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};

// Agregando ese esquema a winston 
winston.addColors(colors);

// Creando plantillas para los formatos

// Formato de consola 
const myConsoleFormat = combine(
  // Colores del formato
  colorize({ all: true }),
  // Agregando una etiqueta
  label({ label: '📢' }),
  // Agregando fechas
  timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
  // Funcion de impresion 
  printf((info) => `${info.level} ⚤ ${info.label} ⚤ ${info.timestamp} ⚤ ${info.message}`),
);

// Formato para los archivos JSON
const myFileFormat = combine(
  // Retirar colorizacion 
  format.uncolorize(),
  // Agregar Fecha ISO
  timestamp(),
  // Salida
  format.json(),
);

// Construyendo y configurando transportes
const options = {
  errorFile: {
    level: 'error',
    filename: path.join(rootDir, 'logs', 'error.log'),
    maxsize: 5242880, //  5MB
    maxFiles: 2,
    format: myFileFormat,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    format: myConsoleFormat,
  },
  readableFile: {
    level: 'info',
    filename: path.join(rootDir, 'logs', 'readable.log'),
    maxsize: 5242880, //  5MB
    maxFiles: 2,
    format: combine(
      format.uncolorize(),
      timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
      prettyPrint(),
    ),
  },
  dailyRotateFile: {
    level: 'info',
    filename: path.join(logsDir, 'app-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: 5242880, //  5MB
    maxFiles: 2,
    format: myFileFormat,
  },
};

// Creando el logger
const logger = winston.createLogger({
  transports: [
    new DailyRotateFile(options.dailyRotateFile),
    new winston.transports.File(options.readableFile),
    new winston.transports.File(options.errorFile),
    new winston.transports.Console(options.console),
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, 'exceptions.log'),
    }),
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, 'rejections.log'),
    }),
  ],
  exitOnError: false,
});
 
// Exportamos
export default logger;