# Source: https://betterstack.com/community/guides/scaling-nodejs/deno-vs-tsx/
# Original language: typescript
# Normalized: ts
# Block index: 13

// TSX testing with Node.js test runner
import { test } from "node:test";
import assert from "node:assert";
import { UserService } from "../services/user.ts";

test("user service functionality", async () => {
  const service = new UserService();
  const user = await service.create({ name: "Alice" });
  assert.strictEqual(user.name, "Alice");
});