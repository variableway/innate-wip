# Source: https://betterstack.com/community/guides/logging/logging-framework/
# Original language: javascript
# Normalized: js
# Block index: 6

const pino = require('pino');

const logger = pino({
  formatters: {
    [highlight]
    bindings: (bindings) => {
      return { pid: bindings.pid, host: bindings.hostname, node_version: process.version };
    },
    [/highlight]
  },
});