# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-json-type-safety/
# Original language: typescript
# Normalized: ts
# Block index: 14

[label src/mismatched-json.ts]
interface User {
  name: string;
  age: number;
  active: boolean;
}

// JSON has wrong types
const jsonString = '{"name": "Alice", "age": "thirty", "active": "yes"}';

const user = JSON.parse(jsonString) as User;

console.log(`Age next year: ${user.age + 1}`);
console.log(user.active ? "Active" : "Inactive");