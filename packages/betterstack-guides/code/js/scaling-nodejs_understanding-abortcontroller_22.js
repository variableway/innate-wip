# Source: https://betterstack.com/community/guides/scaling-nodejs/understanding-abortcontroller/
# Original language: javascript
# Normalized: js
# Block index: 22

const controller = new AbortController();
const { signal } = controller;
const grep = spawn("grep", ["ssh"], { signal });
grep.on("error", (err) => {
  // This will be called with err being an AbortError if the controller aborts
});
controller.abort(); // stops the process