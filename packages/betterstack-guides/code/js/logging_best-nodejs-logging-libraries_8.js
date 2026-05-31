# Source: https://betterstack.com/community/guides/logging/best-nodejs-logging-libraries/
# Original language: javascript
# Normalized: js
# Block index: 8

const winston = require('winston');
const { combine, timestamp, json } = winston.format;

const { Logtail } = require('@logtail/node');

const { LogtailTransport } = require('@logtail/winston');

const logtail = new Logtail('<your_source_token>');

const logger = winston.createLogger({
  level: 'info',
  format: combine(timestamp(), json()),
[highlight]
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: 'app.log',
    }),
    new LogtailTransport(logtail),
  ],
[/highlight]
});