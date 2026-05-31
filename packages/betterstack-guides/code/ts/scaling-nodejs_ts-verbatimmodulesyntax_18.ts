# Source: https://betterstack.com/community/guides/scaling-nodejs/ts-verbatimmodulesyntax/
# Original language: typescript
# Normalized: ts
# Block index: 18

[label src/app.ts]
[highlight]
import type { LogLevel } from "./logger.js";
import "./logger.js";
[/highlight]

export function processData(): void {
  const entry: LogLevel = {
    level: "info",
    timestamp: new Date(),
    message: "Processing data"
  };
  console.log("Processing:", entry.message);
}

processData();