# Source: https://betterstack.com/community/guides/scaling-nodejs/introduction-to-bun-for-nodejs-users/
# Original language: javascript
# Normalized: js
# Block index: 20

[label index.js]
import assert from "node:assert";

function add(a, b) {
 return a + b;
}

assert.strictEqual(
 add(2, 3),
 5,
 "The add function should return the sum of two numbers"
);
console.log("All tests passed!");