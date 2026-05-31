# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-errors/
# Original language: javascript
# Normalized: js
# Block index: 35

import pino from 'pino';

const logger = pino();

function alwaysThrowError() {
  throw new Error('processing error');
}

try {
  alwaysThrowError();
} catch (err) {
  logger.error(
    err,
    'An unexpected error occurred while processing the request'
  );
}