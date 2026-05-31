# Source: https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-pino-to-log-node-js-applications/
# Original language: javascript
# Normalized: js
# Block index: 45

[label logger.js]
import pino from 'pino';
[highlight]
const __dirname = import.meta.dirname;


const fileTransport = pino.transport({
  target: 'pino/file',
  options: { destination: `${__dirname}/app.log` },
});
[/highlight]

const logger = pino(
  {
    level: process.env.PINO_LOG_LEVEL || 'info',
    formatters: {
      level: (label) => {
        return { level: label.toUpperCase() };
      },
    },
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  [highlight]
  fileTransport
  [/highlight]
);

export default logger;