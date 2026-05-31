# Source: https://betterstack.com/community/guides/scaling-nodejs/deno-vs-tsx/
# Original language: typescript
# Normalized: ts
# Block index: 15

// Deno testing with rich built-in features
import {
  assertEquals,
  assertRejects,
} from "https://deno.land/std@0.208.0/testing/asserts.ts";
import { UserService } from "../services/user.ts";

Deno.test("comprehensive user service testing", async () => {
  const service = new UserService();
  const user = await service.create({ name: "Alice" });

  assertEquals(user.name, "Alice");
  await assertRejects(() => service.create({ name: "" }));
});