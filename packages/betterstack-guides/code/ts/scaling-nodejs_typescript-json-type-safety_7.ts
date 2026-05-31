# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-json-type-safety/
# Original language: typescript
# Normalized: ts
# Block index: 7

[label src/typed-parsing.ts]
interface User {
  name: string;
  age: number;
  active: boolean;
}

const jsonString = '{"name": "Alice", "age": 30, "active": true}';

const user = JSON.parse(jsonString) as User;

console.log(user.name.toUpperCase());
console.log(user.age + 5);
console.log(user.active ? "Active user" : "Inactive user");