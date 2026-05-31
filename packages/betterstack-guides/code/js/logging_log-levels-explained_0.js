# Source: https://betterstack.com/community/guides/logging/log-levels-explained/
# Original language: javascript
# Normalized: js
# Block index: 0

const pino = require('pino');

const logger = pino({
  formatters: {
    bindings: (bindings) => {
      return {
        env: process.env.NODE_ENV || 'production',
        server: process.env.server,
      };
    },
    level: (label) => {
      return { level: label };
    },
  },
});

[highlight]
logger.fatal(
  new Error('no space available for write operations'),
  'Disk space critically low'
);
process.exit(1);
[/highlight]