# Source: https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-pino-to-log-node-js-applications/
# Original language: javascript
# Normalized: js
# Block index: 63

const logger = pino({
  redact: {
    paths: [
      'name',
      'address',
      'passport',
      'phone',
      'user.name',
      'user.address',
      'user.passport',
      'user.phone',
      '*.user.name', // * is a wildcard covering a depth of 1
      '*.user.address',
      '*.user.passport',
      '*.user.phone',
    ],
    remove: true,
  },
});