# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-module-resolution/
# Original language: typescript
# Normalized: ts
# Block index: 6

[label src/index.ts]
import { Logger } from "./services/logger";

const logger = new Logger();
logger.log("Application started");
logger.error("Sample error");