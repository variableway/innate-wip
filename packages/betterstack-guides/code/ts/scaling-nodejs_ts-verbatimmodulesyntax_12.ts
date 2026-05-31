# Source: https://betterstack.com/community/guides/scaling-nodejs/ts-verbatimmodulesyntax/
# Original language: typescript
# Normalized: ts
# Block index: 12

[label src/app.ts]
import { LogLevel } from "./logger.js";

export function processData(): void {
  const entry: LogLevel = {
    level: "info",
    timestamp: new Date(),
    message: "Processing data"
  };
  console.log("Processing:", entry.message);
}

processData();