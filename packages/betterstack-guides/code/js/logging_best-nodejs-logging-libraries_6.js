# Source: https://betterstack.com/community/guides/logging/best-nodejs-logging-libraries/
# Original language: javascript
# Normalized: js
# Block index: 6

const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

logger.info('Hello from Winston logger!')