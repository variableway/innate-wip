# Source: https://betterstack.com/community/guides/scaling-nodejs/ts-verbatimmodulesyntax/
# Original language: javascript
# Normalized: js
# Block index: 14

[output];
export function processData() {
  const entry = {
    level: "info",
    timestamp: new Date(),
    message: "Processing data",
  };
  console.log("Processing:", entry.message);
}
processData();