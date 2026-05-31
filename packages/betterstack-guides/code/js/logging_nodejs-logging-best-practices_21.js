# Source: https://betterstack.com/community/guides/logging/nodejs-logging-best-practices/
# Original language: javascript
# Normalized: js
# Block index: 21

const pino = require('pino');
const logger = pino({
  level: process.env.PINO_LOG_LEVEL || 'debug',
  timestamp: pino.stdTimeFunctions.isoTime,
  [highlight]
  redact: {
    paths: ['name', 'password', 'profile.address', 'profile.phone'],
    remove: true,
  },
  [/highlight]
});

. . .