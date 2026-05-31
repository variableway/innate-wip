# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-json-type-safety/
# Original language: typescript
# Normalized: ts
# Block index: 8

[label src/typed-parsing.ts]
interface User {
  name: string;
  age: number;
  active: boolean;
}

const jsonString = '{"name": "Alice", "age": 30, "active": true}';

const user = JSON.parse(jsonString) as User;

...
[highlight]
console.log(user.email); // Error!
[/highlight]