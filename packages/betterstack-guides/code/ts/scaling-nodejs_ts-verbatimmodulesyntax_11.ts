# Source: https://betterstack.com/community/guides/scaling-nodejs/ts-verbatimmodulesyntax/
# Original language: typescript
# Normalized: ts
# Block index: 11

[label src/logger.ts]
export interface LogLevel {
  level: "info" | "warn" | "error";
  timestamp: Date;
  message: string;
}

// Side effect: register global error handler
globalThis.addEventListener?.("error", (event) => {
  console.error("[Global Error Handler]", event.message);
});

export function log(level: LogLevel["level"], message: string): void {
  const logEntry: LogLevel = {
    level,
    timestamp: new Date(),
    message
  };
  console.log(`[${logEntry.level.toUpperCase()}] ${logEntry.message}`);
}