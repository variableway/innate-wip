# Source: https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-winston-and-morgan-to-log-node-js-applications/
# Original language: javascript
# Normalized: js
# Block index: 9

[label logger.js]
...

const logger = winston.createLogger({
[highlight]
  level: process.env.LOG_LEVEL || 'info',
[/highlight]
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});