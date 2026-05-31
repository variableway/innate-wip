# Source: https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-pino-to-log-node-js-applications/
# Original language: javascript
# Normalized: js
# Block index: 39

[label index.js]
import logger from './logger.js';

logger.info('starting the program');

function getUser(userID) {
  const childLogger = logger.child({ userID });
  childLogger.trace('getUser called');
  // retrieve user data and return it
  childLogger.trace('getUser completed');
}

getUser('johndoe');

logger.info('ending the program');