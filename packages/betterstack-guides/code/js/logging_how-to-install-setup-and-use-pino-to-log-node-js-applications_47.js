# Source: https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-pino-to-log-node-js-applications/
# Original language: javascript
# Normalized: js
# Block index: 47

[label logger.js]
import pino from 'pino';

const __dirname = import.meta.dirname;

[highlight]
const transport = pino.transport({
  targets: [
    {
      target: 'pino/file',
      options: { destination: `${__dirname}/app.log` },
    },
    {
      target: 'pino/file', // logs to the standard output by default
    },
  ],
});
[/highlight]

const logger = pino(
  {
    level: process.env.PINO_LOG_LEVEL || 'info',
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  [highlight]
  transport
  [/highlight]
);

export default logger;