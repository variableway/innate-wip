# Source: https://betterstack.com/community/guides/logging/nodejs-logging-best-practices/
# Original language: javascript
# Normalized: js
# Block index: 13

const pino = require('pino');
const logger = pino({
  timestamp: () => `,"timestamp":"${new Date(Date.now()).toISOString()}"`,
});

logger.info(
  {
    requestID: "f9ed4675f1c53513c61a3b3b4e25b4c0",
  },
  "Uploading 'image.png' was successful",
);