# Source: https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-pino-to-log-node-js-applications/
# Original language: javascript
# Normalized: js
# Block index: 31

[label logger.js]
...
const logger = pino({
  ...
[highlight]
  timestamp: () => `,"timestamp":"${new Date(Date.now()).toISOString()}"`,
[/highlight]
});