# Source: https://betterstack.com/community/guides/logging/nodejs-logging-best-practices/
# Original language: javascript
# Normalized: js
# Block index: 19

const pino = require('pino');
const logger = pino({
  level: process.env.PINO_LOG_LEVEL || 'debug',
  timestamp: pino.stdTimeFunctions.isoTime,
  redact: ['name', 'email', 'password', 'profile.address', 'profile.phone'],
});

const user = {
  name: 'John doe',
  id: '283487',
  email: 'john@doe.com',
  profile: {
    address: '1, Avengers street',
    phone: 123456789,
    favourite_color: 'Red',
  },
};

logger.info(user, 'user profile updated');