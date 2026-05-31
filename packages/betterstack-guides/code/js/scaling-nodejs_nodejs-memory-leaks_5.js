# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-memory-leaks/
# Original language: javascript
# Normalized: js
# Block index: 5

function outer(elementCount) {
  // Create an array containing numbers from 0 to elementCount value
  let elements = Array.from(Array(elementCount).keys());

  return function inner() {
    // return a random number
    return elements[Math.floor(Math.random() * elements.length)];
  };
}