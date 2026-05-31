# Source: https://betterstack.com/community/guides/logging/best-nodejs-logging-libraries/
# Original language: javascript
# Normalized: js
# Block index: 16

const bunyan = require('bunyan');
const logger = bunyan.createLogger({ name: 'myapp' });
logger.info('Hello from Bunyan logger');