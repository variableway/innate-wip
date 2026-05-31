# Source: https://betterstack.com/community/guides/logging/nodejs-logging-best-practices/
# Original language: javascript
# Normalized: js
# Block index: 15

const child = logger.child({
  service: 'UserService',
});

child.info({ userID: 'USR-1234' }, "user 'USR-1234' updated successfully");