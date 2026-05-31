# Source: https://betterstack.com/community/guides/logging/best-nodejs-logging-libraries/
# Original language: javascript
# Normalized: js
# Block index: 5

const pino = require('pino');
const logger = pino(
  pino.destination({
    sync: false, // Enable asynchronous logging
    minLength: 4096, // size of buffer before writing the logs
  })
);