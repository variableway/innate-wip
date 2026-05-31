# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-json-type-safety/
# Original language: typescript
# Normalized: ts
# Block index: 4

[label src/basic-parsing.ts]
const jsonString = '{"name": "Alice", "age": 30, "active": true}';

const data = JSON.parse(jsonString);

console.log(data.name);
[highlight]
console.log(data.nonExistent); // No error at compile time
console.log(data.age.toUpperCase()); // No error at compile time
[/highlight]