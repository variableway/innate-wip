# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-timeouts/
# Original language: javascript
# Normalized: js
# Block index: 14

import timersPromises from 'node:timers/promises';

function slowOperation() {
  // resolve in 10 seconds
  return timersPromises.setTimeout(10000);
}

(async function doSomethingAsync() {
  try {
    await slowOperation();
    console.log('Completed slow operation');
  } catch (err) {
    console.error('Failed to complete slow operation due to error:', err);
  }
})();