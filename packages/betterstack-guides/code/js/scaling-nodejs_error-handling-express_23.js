# Source: https://betterstack.com/community/guides/scaling-nodejs/error-handling-express/
# Original language: javascript
# Normalized: js
# Block index: 23

[label utils/logger.js]
import pino from "pino";

const transport = pino.transport({
  targets: [
    {
      target: "@logtail/pino",
      options: { sourceToken: "<your_better_stack_source_token>" }, // Send logs to Better Stack
    },
  ],
});

export const logger = pino({ level: "info" }, transport);