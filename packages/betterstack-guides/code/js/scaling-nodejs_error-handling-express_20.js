# Source: https://betterstack.com/community/guides/scaling-nodejs/error-handling-express/
# Original language: javascript
# Normalized: js
# Block index: 20

[label utils/logger.js]
import pino from "pino";

export const logger = pino({
  level: "info",
  transport: {
    target: "pino-pretty", // Formats logs for better readability in development
  },
});