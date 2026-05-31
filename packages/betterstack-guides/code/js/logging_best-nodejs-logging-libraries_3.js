# Source: https://betterstack.com/community/guides/logging/best-nodejs-logging-libraries/
# Original language: javascript
# Normalized: js
# Block index: 3

const pino = require('pino');

const logger = pino({
  level: process.env.PINO_LOG_LEVEL || 'debug',
  timestamp: pino.stdTimeFunctions.isoTime,
[highlight]
  redact: {
    paths: ['email'],
  },
[/highlight]
});

const user = {
  name: 'John doe',
  id: '283487',
  email: 'john@doe.com',
};

// the `email` field in the user object will be redacted
logger.info(user, 'user profile updated');