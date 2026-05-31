# Source: https://betterstack.com/community/guides/logging/log-levels-explained/
# Original language: javascript
# Normalized: js
# Block index: 15

const pino = require('pino');

const levels = {
  fatal: 60,
  error: 50,
  warn: 40,
[highlight]
  security: 35,
[/highlight]
  info: 30,
  debug: 20,
  trace: 10,
};

const logger = pino({
  level: 'debug',
  [highlight]
  customLevels: levels,
  useOnlyCustomLevels: true,
  [/highlight]
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
logger.security('A notable security event');
[/highlight]