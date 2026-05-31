# Source: https://betterstack.com/community/guides/scaling-nodejs/pino-vs-bunyan/
# Original language: javascript
# Normalized: js
# Block index: 9

const transport = pino.transport({
  targets: [
    { target: 'pino/file', options: { destination: 1 } },
    { target: 'pino/file', options: { destination: '/var/log/error.log', level: 'error' } }
  ]
});

const logger = pino({ level: process.env.LOG_LEVEL || 'info' }, transport);