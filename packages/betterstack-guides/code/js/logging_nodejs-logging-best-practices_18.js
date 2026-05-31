# Source: https://betterstack.com/community/guides/logging/nodejs-logging-best-practices/
# Original language: javascript
# Normalized: js
# Block index: 18

const pino = require('pino');
const logger = pino();

process.on('uncaughtException', (err) => {
  logger.fatal(err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  logger.fatal(err);
  process.exit(1);
});