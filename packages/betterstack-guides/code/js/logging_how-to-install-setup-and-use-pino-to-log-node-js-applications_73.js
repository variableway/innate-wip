# Source: https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-pino-to-log-node-js-applications/
# Original language: javascript
# Normalized: js
# Block index: 73

[label logger.js]
import pino from 'pino';
const __dirname = import.meta.dirname;

const transport = pino.transport({
  targets: [
    {
      target: 'pino/file',
      options: { destination: `${__dirname}/server.log` },
    },
    {
      target: '@logtail/pino',
      options: { 
[highlight]
        sourceToken: '<your_better_stack_source_token>',
        options: { endpoint: 'https://<your_ingesting_host>' }
[/highlight]
      },
    },
    {
      target: 'pino-pretty',
    },
  ],
});

const logger = pino(
  {
    level: process.env.PINO_LOG_LEVEL || 'info',
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  transport
);

export default logger;