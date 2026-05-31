# Source: https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-pino-to-log-node-js-applications/
# Original language: javascript
# Normalized: js
# Block index: 46

[label logger.js]
import pino from 'pino';

const __dirname = import.meta.dirname;

const logger = pino(
  {
    level: process.env.PINO_LOG_LEVEL || 'info',
    formatters: {
      level: (label) => {
        return { level: label.toUpperCase() };
      },
    },
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  [highlight]
  pino.destination(`${__dirname}/app.log`)
  [/highlight]
);

export default logger;