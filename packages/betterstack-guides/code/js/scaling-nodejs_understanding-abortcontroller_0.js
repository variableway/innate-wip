# Source: https://betterstack.com/community/guides/scaling-nodejs/understanding-abortcontroller/
# Original language: javascript
# Normalized: js
# Block index: 0

[label slow-operation.js]
import timersPromises from "node:timers/promises";

async function slowOperation() {
  // Resolve in 10 seconds
  return timersPromises.setTimeout(10000);
}

async function doSomethingAsync() {
  try {
    await slowOperation();
    console.log("Completed slow operation");
  } catch (err) {
    console.error("Failed to complete slow operation due to error:", err);
  }
}

doSomethingAsync();