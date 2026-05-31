# Source: https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-pino-to-log-node-js-applications/
# Original language: javascript
# Normalized: js
# Block index: 29

[label logger.js]
import pino from 'pino';

const logger = pino({
  level: process.env.PINO_LOG_LEVEL || 'info',
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    },
  },
  [highlight]
  timestamp: pino.stdTimeFunctions.isoTime,
  [/highlight]
});

export default logger;