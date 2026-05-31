# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-module-resolution/
# Original language: typescript
# Normalized: ts
# Block index: 18

[label src/index.ts]
import { Logger } from "./services/logger.js";
import { displayNextWeek } from "./date-handler.js";

const logger = new Logger();
logger.log("Application started");

displayNextWeek();