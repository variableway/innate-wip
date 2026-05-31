# Source: https://betterstack.com/community/guides/scaling-nodejs/esbuild-explained/
# Original language: javascript
# Normalized: js
# Block index: 2

[label src/utils.js]
export function greet(name) {
  return `Hello, ${name}!`;
}

export function getCurrentTime() {
  const now = new Date();
  return now.toLocaleTimeString();
}