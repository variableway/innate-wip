# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-json-type-safety/
# Original language: typescript
# Normalized: ts
# Block index: 21

[label src/type-guards.ts]
interface User {
  name: string;
  age: number;
  active: boolean;
}

function isUser(value: unknown): value is User {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const obj = value as Record<string, unknown>;

  return (
    typeof obj.name === "string" &&
    typeof obj.age === "number" &&
    typeof obj.active === "boolean"
  );
}

const jsonString = '{"name": "Alice", "age": "thirty", "active": "yes"}';
const parsed = JSON.parse(jsonString);

if (isUser(parsed)) {
  console.log(`User: ${parsed.name}, Age: ${parsed.age}`);
  console.log(`Status: ${parsed.active ? "Active" : "Inactive"}`);
} else {
  console.error("Invalid user data");
}