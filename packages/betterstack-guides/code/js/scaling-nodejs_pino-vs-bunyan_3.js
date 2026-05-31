# Source: https://betterstack.com/community/guides/scaling-nodejs/pino-vs-bunyan/
# Original language: javascript
# Normalized: js
# Block index: 3

const pino = require('pino');
const logger = pino({}, pino.destination('/dev/null'));

console.time('pino-logs');
for (let i = 0; i < 1000; i++) {
  logger.info({ iteration: i }, 'Log entry');
}
console.timeEnd('pino-logs');
// Typical result: ~8ms