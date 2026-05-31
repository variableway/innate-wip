# Source: https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-pino-to-log-node-js-applications/
# Original language: javascript
# Normalized: js
# Block index: 21

[label index.js]
import logger from './logger.js';

logger.warn('warn');
[highlight]
logger.notice('notice');
[/highlight]
logger.info('info');