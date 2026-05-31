# Source: https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-pino-to-log-node-js-applications/
# Original language: javascript
# Normalized: js
# Block index: 33

[label logger.js]
import pino from 'pino';

const logger = pino({
  level: process.env.PINO_LOG_LEVEL || 'info',
  formatters: {
    [highlight]
    bindings: (bindings) => {
      return { pid: bindings.pid, host: bindings.hostname };
    },
    [/highlight]
    level: (label) => {
      return { level: label.toUpperCase() };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

export default logger;