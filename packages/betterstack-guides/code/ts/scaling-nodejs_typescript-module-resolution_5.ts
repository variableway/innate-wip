# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-module-resolution/
# Original language: typescript
# Normalized: ts
# Block index: 5

[label src/services/logger.ts]
import { formatMessage, formatError } from "../utils/formatter";

export class Logger {
  log(message: string): void {
    console.log(formatMessage(message));
  }

  error(message: string): void {
    console.error(formatError(message));
  }
}