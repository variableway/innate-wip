# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-declaration-files/
# Original language: typescript
# Normalized: ts
# Block index: 13

[label src/use-store.ts]
import { DataStore, createStore } from "./data-store.js";

// Explicit type parameters
const userStore = new DataStore<string, { name: string; age: number }>();
userStore.set("user1", { name: "Alice", age: 30 });
const user = userStore.get("user1");

if (user) {
  console.log(user.name); // TypeScript knows user has name property
}

// Type inference from initial data
const configStore = createStore({
  apiKey: "abc123",
  timeout: 5000,
  debug: true
});

const apiKey = configStore.get("apiKey"); // TypeScript knows this is string | undefined
const timeout = configStore.get("timeout"); // TypeScript knows this is number | undefined

// Type errors are caught
userStore.set("user2", "invalid"); // Error: string is not assignable to user object
configStore.get(123); // Error: number is not assignable to string keys