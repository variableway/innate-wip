# Source: https://betterstack.com/community/guides/scaling-nodejs/understanding-abortcontroller/
# Original language: javascript
# Normalized: js
# Block index: 3

[label slow-operation.js]
import timersPromises from "node:timers/promises";

[highlight]
async function slowOperation({ signal }) {
  return timersPromises.setTimeout(10000, null, { signal });
}
[/highlight]

async function doSomethingAsync() {
[highlight]
  const controller = new AbortController();
  const signal = controller.signal;

  setTimeout(() => controller.abort(), 5000); // Abort after 5 seconds
[/highlight]

  try {
[highlight]
    await slowOperation({ signal });
[/highlight]
    console.log("Completed slow operation");
  } catch (err) {
[highlight]
    if (err.name === "AbortError") {
      console.error("Operation aborted");
    } else {
[/highlight]
      console.error("Failed to complete slow operation due to error:", err);
    }
  }
}
doSomethingAsync();