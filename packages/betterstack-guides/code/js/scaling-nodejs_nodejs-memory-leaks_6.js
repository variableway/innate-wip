# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-memory-leaks/
# Original language: javascript
# Normalized: js
# Block index: 6

let getRandom = outer(10000);
console.log(getRandom());
console.log(getRandom());