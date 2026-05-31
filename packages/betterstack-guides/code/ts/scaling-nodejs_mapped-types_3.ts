# Source: https://betterstack.com/community/guides/scaling-nodejs/mapped-types/
# Original language: typescript
# Normalized: ts
# Block index: 3

[label src/problem.ts]
interface User {
  id: number;
  name: string;
  email: string;
}

// Manual duplication for partial updates
interface UserUpdate {
  id?: number;
  name?: string;
  email?: string;
}

// Manual duplication for readonly views
interface UserDisplay {
  readonly id: number;
  readonly name: string;
  readonly email: string;
}

const update: UserUpdate = { name: "Alice Smith" };
const display: UserDisplay = { id: 1, name: "Alice", email: "alice@example.com" };

console.log("Update:", update);
console.log("Display:", display);