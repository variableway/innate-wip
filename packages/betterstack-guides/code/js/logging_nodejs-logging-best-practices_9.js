# Source: https://betterstack.com/community/guides/logging/nodejs-logging-best-practices/
# Original language: javascript
# Normalized: js
# Block index: 9

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
});

const logger = pino({
  level: process.env.LOG_LEVEL || 'warn',
});