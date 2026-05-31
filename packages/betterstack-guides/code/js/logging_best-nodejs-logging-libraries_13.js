# Source: https://betterstack.com/community/guides/logging/best-nodejs-logging-libraries/
# Original language: javascript
# Normalized: js
# Block index: 13

const log4js = require('log4js');
[highlight]
const jsonLayout = require('log4js-json-layout');

log4js.addLayout('json', jsonLayout);
log4js.configure({
  appenders: { out: { type: 'stdout', layout: { type: 'json' } } },
  categories: { default: { appenders: ['out'], level: 'info' } },
});
[/highlight]

const logger = log4js.getLogger();
logger.level = 'info';
logger.info('Hello from Log4js-node', { name: 'John', age: 21 });