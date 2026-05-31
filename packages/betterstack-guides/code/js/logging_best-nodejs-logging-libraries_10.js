# Source: https://betterstack.com/community/guides/logging/best-nodejs-logging-libraries/
# Original language: javascript
# Normalized: js
# Block index: 10

const log4js = require('log4js');
const logger = log4js.getLogger();
logger.level = 'info';
logger.info('Hello from Log4js-node', { name: 'John', age: 21 });