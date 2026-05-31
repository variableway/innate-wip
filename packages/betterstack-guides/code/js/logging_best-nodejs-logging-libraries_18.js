# Source: https://betterstack.com/community/guides/logging/best-nodejs-logging-libraries/
# Original language: javascript
# Normalized: js
# Block index: 18

logger.info(
  { width: 300, height: 400, file: 'needsmore.jpg' },
  'image uploaded successfully'
);
logger.error(new Error('request failed to complete'));