# Source: https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-pino-to-log-node-js-applications/
# Original language: javascript
# Normalized: js
# Block index: 60

const logger = pino({
  redact: {
    paths: ['user.name', 'user.address', 'user.passport', 'user.phone'],
    censor: '[PINO REDACTED]',
    [highlight]
    remove: true,
    [/highlight]
  },
});