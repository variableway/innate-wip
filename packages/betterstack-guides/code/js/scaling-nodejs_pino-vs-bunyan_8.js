# Source: https://betterstack.com/community/guides/scaling-nodejs/pino-vs-bunyan/
# Original language: javascript
# Normalized: js
# Block index: 8

const logger = bunyan.createLogger({
  name: 'production-app',
  level: process.env.LOG_LEVEL || 'info',
  streams: [
    { level: 'info', stream: process.stdout },
    { level: 'error', path: '/var/log/error.log' }
  ]
});