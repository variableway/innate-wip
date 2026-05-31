# Source: https://betterstack.com/community/guides/logging/best-nodejs-logging-libraries/
# Original language: javascript
# Normalized: js
# Block index: 15

const log4js = require('log4js');
const jsonLayout = require('log4js-json-layout');

log4js.addLayout('json', jsonLayout);
log4js.configure({
  appenders: {
    out: { type: 'stdout' },
    app: { type: 'file', filename: 'app.log', layout: { type: 'json' } },
  },
  categories: {
    default: { appenders: ['out'], level: 'info' },
    app: { appenders: ['app'], level: 'debug' },
  },
});

const defaultLogger = log4js.getLogger();
defaultLogger.info('Hello from Log4js-node', { name: 'John', age: 21 });

const appLogger = log4js.getLogger('app');
appLogger.info('Hello from Log4js-node', { name: 'John', age: 21 });