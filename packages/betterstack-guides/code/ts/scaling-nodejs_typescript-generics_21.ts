# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-generics/
# Original language: typescript
# Normalized: ts
# Block index: 21

type Readonly<T> = {
  readonly [P in keyof T]: T[P]
};

interface User {
  id: number;
  name: string;
  email: string;
}

const user: User = {
  id: 1,
  name: "Alice",
  email: "alice@example.com"
};

const readonlyUser: Readonly<User> = user;

// This would cause an error
// readonlyUser.name = "Bob";  // Error: Cannot assign to 'name' because it is a read-only property