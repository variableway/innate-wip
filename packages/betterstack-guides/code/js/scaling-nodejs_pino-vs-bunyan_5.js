# Source: https://betterstack.com/community/guides/scaling-nodejs/pino-vs-bunyan/
# Original language: javascript
# Normalized: js
# Block index: 5

const pino = require('pino');

const transport = pino.transport({
  targets: [
    { target: 'pino/file', options: { destination: 1 } },
    { target: 'pino/file', options: { destination: '/var/log/app.log' } }
  ]
});

const logger = pino({ serializers: pino.stdSerializers }, transport);
logger.error({ err: new Error('Failed') }, 'Error occurred');