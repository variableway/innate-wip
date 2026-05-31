# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-module-resolution/
# Original language: typescript
# Normalized: ts
# Block index: 14

[label src/services/logger.ts]
[highlight]
import { formatMessage, formatError } from "../utils/formatter";
[/highlight]

export class Logger {
  log(message: string): void {
    console.log(formatMessage(message));
  }

  error(message: string): void {
    console.error(formatError(message));
  }
}