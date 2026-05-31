# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-memory-leaks/
# Original language: javascript
# Normalized: js
# Block index: 4

function setName() {
  name = "Stanley";
}
setName();
console.log(name);