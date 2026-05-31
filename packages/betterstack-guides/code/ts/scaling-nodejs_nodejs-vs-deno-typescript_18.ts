# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-vs-deno-typescript/
# Original language: typescript
# Normalized: ts
# Block index: 18

// Node.js testing with built-in test runner
import { test } from "node:test";
import assert from "node:assert";

test("TypeScript test example", () => {
  assert.strictEqual(1 + 1, 2);
});