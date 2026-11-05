// Importando bibliotecas de node
import path from 'node:path';
import fs from 'node:fs';
// Importando el core de winston y format
import winston, { format } from 'winston';
// Importando plug-in de winston para rotación de archivos
import DailyRotateFile from 'winston-daily-rotate-file';

// Desestructurar funciones utiles de format
const {
  combine, timestamp, label, printf, colorize,
} = format;

// Creando variable del directorio raiz y de logs
const rootDir = path.resolve(process.cwd());
const logsDir = path.join(rootDir, 'logs');

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Definiendo esquema de colores
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};

// Agregando ese esquema a winston
winston.addColors(colors);

// Formato de consola
const myConsoleFormat = combine(
  // Colores del formato
  colorize({ all: true }),
  // Agregando una etiqueta
  label({ label: '📢: ' }),
  // Agregando fecha
  timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
  // Función de impresion
  printf(
    (info) => `${info.level} ► ${info.label} ► ${info.timestamp} ► ${info.message}`,
  ),
);

// Formato para los archivos JSON
const myFileFormat = combine(
  // Retirar colorizacion
  format.uncolorize(),
  // Agregar fecha ISO
  timestamp(),
  // Salida JSON
  format.json(),
);

// Opciones de configuración para los transports de logs
const options = {
  errorFile: {
    level: 'error',
    filename: path.join(logsDir, 'error.log'),
    maxsize: 5242880, // 5MB
    maxFiles: 2,
    format: myFileFormat,
  },
  readableFile: {
    level: 'info',
    filename: path.join(logsDir, 'readable.log'),
    maxsize: 5242880, // 5MB
    maxFiles: 2,
    format: combine(
      format.uncolorize(),
      timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
      printf((info) => `[${info.level}] : ${info.timestamp} : ${info.message}`),
    ),
  },
  dailyRotate: {
    filename: path.join(logsDir, 'app-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxsize: 5242880, // 5MB
    maxFiles: 2,
    format: myFileFormat,
  },
};

// Creando el logger de Winston
const logger = winston.createLogger({
  level: 'debug',
  levels: winston.config.npm.levels,
  transports: [
    new winston.transports.Console({
      format: myConsoleFormat,
    }),
    new winston.transports.File(options.errorFile),
    new winston.transports.File(options.readableFile),
    new DailyRotateFile(options.dailyRotate),
  ],
  exitOnError: false,
});

// Exportamos
export default logger;