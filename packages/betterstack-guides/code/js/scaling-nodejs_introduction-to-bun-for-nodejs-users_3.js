# Source: https://betterstack.com/community/guides/scaling-nodejs/introduction-to-bun-for-nodejs-users/
# Original language: javascript
# Normalized: js
# Block index: 3

[label index_test.js]
import { expect, test } from "bun:test";

test("addition of two numbers", () => {
  const result = 2 + 2;
  expect(result).toBe(4);
});