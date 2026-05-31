# Source: https://betterstack.com/community/guides/scaling-nodejs/mapped-types/
# Original language: typescript
# Normalized: ts
# Block index: 6

[label src/problem.ts]
interface User {
  id: number;
  name: string;
  email: string;
}

[highlight]
// Mapped type that makes all properties optional
type UserUpdate = {
  [K in keyof User]?: User[K];
};

// Mapped type that makes all properties readonly
type UserDisplay = {
  readonly [K in keyof User]: User[K];
};
[/highlight]

const update: UserUpdate = { name: "Alice Smith" };
const display: UserDisplay = { id: 1, name: "Alice", email: "alice@example.com" };

// This would cause an error:
// display.name = "Bob";  // Error: Cannot assign to 'name' because it is a read-only property

console.log("Update:", update);
console.log("Display:", display);