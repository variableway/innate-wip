# Source: https://betterstack.com/community/guides/logging/nodejs-logging-best-practices/
# Original language: javascript
# Normalized: js
# Block index: 11

const pino = require("pino");
const logger = pino({
  [highlight]
  timestamp: () => `",timestamp":"${new Date(Date.now()).toISOString()}"`,
  [/highlight]
});

logger.info("Server restarted after receiving shutdown signal")