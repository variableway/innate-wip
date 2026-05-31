# Source: https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-pino-to-log-node-js-applications/
# Original language: javascript
# Normalized: js
# Block index: 42

[label index.js]
import logger from './logger.js';

function alwaysThrowError() {
  throw new Error('processing error');
}

try {
  alwaysThrowError();
} catch (err) {
  [highlight]
  logger.error(err, 'An unexpected error occurred while processing the request');
  [/highlight]
}