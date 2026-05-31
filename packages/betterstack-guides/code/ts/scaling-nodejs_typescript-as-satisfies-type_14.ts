# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-as-satisfies-type/
# Original language: typescript
# Normalized: ts
# Block index: 14

[label object-structure.ts]
interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}

// as allows missing or wrong properties
const user1 = {
  id: "123",
  name: "John"
} as User; // No error, missing email and role

const user2 = {
  id: 123, // Wrong type
  name: "John",
  email: "john@example.com",
  role: "superadmin" // Invalid value
} as User; // No error

// satisfies catches all issues
const user3 = {
  id: "123",
  name: "John"
} satisfies User; // Error: missing properties

const user4 = {
  id: 123,
  name: "John",
  email: "john@example.com",
  role: "superadmin"
} satisfies User; // Error: wrong types