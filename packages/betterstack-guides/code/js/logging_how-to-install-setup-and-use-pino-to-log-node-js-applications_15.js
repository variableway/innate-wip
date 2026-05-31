# Source: https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-pino-to-log-node-js-applications/
# Original language: javascript
# Normalized: js
# Block index: 15

[label logger.js]
import pino from 'pino';

[highlight]
const logger = pino({
  level: process.env.PINO_LOG_LEVEL || 'info',
});

export default logger;
[/highlight]