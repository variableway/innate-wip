# Source: https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-winston-and-morgan-to-log-node-js-applications/
# Original language: javascript
# Normalized: js
# Block index: 50

[label loggers.js]
import winston from 'winston';

winston.loggers.add('serviceALogger', {
  level: process.env.LOG_LEVEL || 'info',
  defaultMeta: {
    service: 'service-a',
  },
  format: winston.format.logstash(),
  transports: [
    new winston.transports.File({
      filename: 'service-a.log',
    }),
  ],
});

winston.loggers.add('serviceBLogger', {
  level: process.env.LOG_LEVEL || 'info',
  defaultMeta: {
    service: 'service-b',
  },
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});