# Source: https://betterstack.com/community/guides/scaling-nodejs/deno-overview-for-nodejs-users/
# Original language: javascript
# Normalized: js
# Block index: 5

[label app_test.js]
import { assertEquals } from "https://deno.land/std@0.196.0/testing/asserts.ts";

function add(a, b) {
  return a + b;
}

Deno.test("Add two numbers", () => {
  const result = add(2, 2);
  assertEquals(result, 4);
});