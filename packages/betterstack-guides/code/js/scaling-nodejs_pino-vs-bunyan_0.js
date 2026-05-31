# Source: https://betterstack.com/community/guides/scaling-nodejs/pino-vs-bunyan/
# Original language: javascript
# Normalized: js
# Block index: 0

const bunyan = require('bunyan');

const logger = bunyan.createLogger({
  name: 'myapp',
  streams: [
    { level: 'info', stream: process.stdout },
    { level: 'error', path: '/var/log/error.log' }
  ]
});

logger.info({ userId: 123 }, 'User logged in');