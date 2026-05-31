# Source: https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-winston-and-morgan-to-log-node-js-applications/
# Original language: javascript
# Normalized: js
# Block index: 45

[label index.js]
import logger from './logger.js';

// start a timer
logger.profile('test');
setTimeout(() => {
  // End the timer and log the duration
  logger.profile('test');
}, 1000);