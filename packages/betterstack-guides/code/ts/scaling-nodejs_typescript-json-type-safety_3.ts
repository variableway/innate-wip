# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-json-type-safety/
# Original language: typescript
# Normalized: ts
# Block index: 3

[label src/basic-parsing.ts]
const jsonString = '{"name": "Alice", "age": 30, "active": true}';

const data = JSON.parse(jsonString);

console.log(data.name);
console.log(data.age);
console.log(data.active);