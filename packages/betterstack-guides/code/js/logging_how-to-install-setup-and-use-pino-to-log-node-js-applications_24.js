# Source: https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-pino-to-log-node-js-applications/
# Original language: javascript
# Normalized: js
# Block index: 24

[label logger.js]
...
const logger = pino({
  level: process.env.PINO_LOG_LEVEL || 'info',
  [highlight]
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    },
  },
  [/highlight]
});

export default logger;