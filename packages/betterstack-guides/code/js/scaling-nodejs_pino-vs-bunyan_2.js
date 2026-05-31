# Source: https://betterstack.com/community/guides/scaling-nodejs/pino-vs-bunyan/
# Original language: javascript
# Normalized: js
# Block index: 2

const bunyan = require('bunyan');
const logger = bunyan.createLogger({ name: 'benchmark' });

console.time('bunyan-logs');
for (let i = 0; i < 1000; i++) {
  logger.info({ iteration: i }, 'Log entry');
}
console.timeEnd('bunyan-logs');
// Typical result: ~45ms