# Source: https://betterstack.com/community/guides/logging/best-nodejs-logging-libraries/
# Original language: javascript
# Normalized: js
# Block index: 22

const logger = require('roarr').Roarr;

logger.trace('Processing request...');
logger.debug({ data: { foo: 'bar' } }, 'Received data');
logger.info('Request processed successfully.');
logger.warn('Invalid input detected.');
logger.error('Database connection failed.');
logger.fatal('Critical error occurred. Shutting down.');