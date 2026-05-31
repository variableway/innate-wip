# Source: https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-winston-and-morgan-to-log-node-js-applications/
# Original language: javascript
# Normalized: js
# Block index: 34

[label index.js]
import logger from './logger.js';

const childLogger = logger.child({ requestId: 'f9ed4675f1c53513c61a3b3b4e25b4c0' });

childLogger.info('File uploaded successfully', {
  file: 'something.png',
  type: 'image/png',
  userId: 'jdn33d8h2',
});