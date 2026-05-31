# Source: https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-pino-to-log-node-js-applications/
# Original language: javascript
# Normalized: js
# Block index: 62

// the current redaction filter will match
logger.info({ user }, 'User updated');
// the current redaction filter will not match
logger.info({ nested: { user } }, 'User updated');
logger.info(user, 'User updated');