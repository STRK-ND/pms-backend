const winston = require('winston');
require('winston-daily-rotate-file');
const path = require('path');
const colors = require('colors'); // Import colors for manual color formatting

// Define log colors for full text formatting
const logColors = {
  error: message => colors.red.bold(message),
  warn: message => colors.yellow.bold(message),
  info: message => colors.green.bold(message),
  debug: message => colors.blue(message),
};

// 🔁 File Transport (Daily Rotation)
const dailyRotateTransport = new winston.transports.DailyRotateFile({
  filename: 'app-%DATE%.log',
  dirname: path.join(__dirname, '../../logs'), // Logs outside config folder
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
});

// 🖥️ Console Transport (Fully Colored Messages)
const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) => {
      const colorizedMessage = logColors[level] ? logColors[level](message) : message;
      return `${timestamp} [${level.toUpperCase()}]: ${colorizedMessage}`;
    })
  )
});

// 🧠 Create Logger Instance
const logger = winston.createLogger({
  level: 'debug', // Log all levels including debug
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) => {
      const colorizedMessage = logColors[level] ? logColors[level](message) : message;
      return `${timestamp} [${level.toUpperCase()}]: ${colorizedMessage}`;
    })
  ),
  transports: [dailyRotateTransport, consoleTransport], // Save logs to file and console
});

module.exports = logger;
