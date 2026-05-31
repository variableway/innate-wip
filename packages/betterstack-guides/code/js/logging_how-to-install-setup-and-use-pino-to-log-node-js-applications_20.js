# Source: https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-pino-to-log-node-js-applications/
# Original language: javascript
# Normalized: js
# Block index: 20

[label logger.js]
import pino from 'pino';

const levels = {
  notice: 35, // Any number between info (30) and warn (40) will work the same
};

const logger = pino({
  level: process.env.PINO_LOG_LEVEL || 'info',
  customLevels: levels,
});

export default logger;