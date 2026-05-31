# Source: https://betterstack.com/community/guides/logging/best-nodejs-logging-libraries/
# Original language: javascript
# Normalized: js
# Block index: 9

const winston = require('winston');
const { combine, timestamp, json, errors } = winston.format;

const logger = winston.createLogger({
  level: 'info',
[highlight]
  format: combine(errors({ stack: true }), timestamp(), json()),
[/highlight]
  transports: [new winston.transports.Console()],
});

logger.info('Hello from Winston logger!');
logger.error(new Error('An error'));