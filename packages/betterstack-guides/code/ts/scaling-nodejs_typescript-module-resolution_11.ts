# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-module-resolution/
# Original language: typescript
# Normalized: ts
# Block index: 11

[label src/index.ts]
[highlight]
import { Logger } from "./services/logger.js";
[/highlight]

const logger = new Logger();
logger.log("Application started");
logger.error("Sample error");