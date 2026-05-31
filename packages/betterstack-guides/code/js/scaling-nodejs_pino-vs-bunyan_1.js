# Source: https://betterstack.com/community/guides/scaling-nodejs/pino-vs-bunyan/
# Original language: javascript
# Normalized: js
# Block index: 1

const pino = require('pino');

const transport = pino.transport({
  target: 'pino/file',
  options: { destination: '/var/log/app.log' }
});

const logger = pino({}, transport);
logger.info({ userId: 123 }, 'User logged in');