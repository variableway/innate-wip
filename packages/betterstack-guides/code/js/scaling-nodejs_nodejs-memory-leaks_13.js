# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-memory-leaks/
# Original language: javascript
# Normalized: js
# Block index: 13

function setName() {
  [highlight]
  const name = "Stanley";
  [/highlight]
}
setName();
console.log(name);