# Source: https://betterstack.com/community/guides/scaling-nodejs/pino-vs-bunyan/
# Original language: javascript
# Normalized: js
# Block index: 4

const bunyan = require('bunyan');

const logger = bunyan.createLogger({
  name: 'app',
  serializers: bunyan.stdSerializers,
  streams: [
    { level: 'info', stream: process.stdout },
    { 
      level: 'error', 
      type: 'rotating-file',
      path: '/var/log/app.log',
      period: '1d'
    }
  ]
});

logger.error({ err: new Error('Failed') }, 'Error occurred');