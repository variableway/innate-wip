# Source: https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-winston-and-morgan-to-log-node-js-applications/
# Original language: javascript
# Normalized: js
# Block index: 44

import winston from 'winston';
const logger = winston.createLogger({ exitOnError: false });

// or

logger.exitOnError = false;