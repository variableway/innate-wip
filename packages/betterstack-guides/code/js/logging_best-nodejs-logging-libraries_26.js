# Source: https://betterstack.com/community/guides/logging/best-nodejs-logging-libraries/
# Original language: javascript
# Normalized: js
# Block index: 26

const Roarr = require('roarr').Roarr;

const logger = Roarr.child({
  name: 'my-service', // this will be included in all logs
});

logger.info({ userId: 1234 }, 'User login');

logger.debug(
  {
    query: 'SELECT * FROM users',
  },
  'Executing database query'
);

logger.info({ amount: 100 }, 'Processing payment');