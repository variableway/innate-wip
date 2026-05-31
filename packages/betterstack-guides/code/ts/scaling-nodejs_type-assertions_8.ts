# Source: https://betterstack.com/community/guides/scaling-nodejs/type-assertions/
# Original language: typescript
# Normalized: ts
# Block index: 8

[label src/danger.ts]
interface User {
  name: string;
  email: string;
}

// Wrong assertion - missing email property
const data = JSON.parse('{"name": "Bob"}') as User;

console.log(`User: ${data.name}`);
console.log(`Email: ${data.email.toLowerCase()}`); // Crashes!