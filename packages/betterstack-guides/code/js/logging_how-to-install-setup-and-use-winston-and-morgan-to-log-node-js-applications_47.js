# Source: https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-winston-and-morgan-to-log-node-js-applications/
# Original language: javascript
# Normalized: js
# Block index: 47

[label index.js]
import logger from './logger.js';

// start a timer
const profiler = logger.startTimer();
setTimeout(() => {
  // End the timer and log the duration
  profiler.done({ message: 'Logging message' });
}, 1000);