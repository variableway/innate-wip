# Source: https://betterstack.com/community/guides/logging/nodejs-logging-best-practices/
# Original language: javascript
# Normalized: js
# Block index: 23

const winston = require('winston');
const { combine, timestamp, json, errors } = winston.format;
const logger = winston.createLogger({
  level: 'info',
  format: combine(errors({ stack: true }), timestamp(), json()),
  transports: [new winston.transports.Console()],
});

const profiler = logger.startTimer();

setTimeout(() => {
  // End the timer and log the duration
  profiler.done({ message: 'Timer completed' });
}, 1000);