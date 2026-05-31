# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-vs-deno-typescript/
# Original language: typescript
# Normalized: ts
# Block index: 20

// Deno testing with built-in assertions
import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";

Deno.test("TypeScript test example", () => {
  assertEquals(1 + 1, 2);
});