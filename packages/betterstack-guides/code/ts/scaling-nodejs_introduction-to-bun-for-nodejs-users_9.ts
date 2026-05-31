# Source: https://betterstack.com/community/guides/scaling-nodejs/introduction-to-bun-for-nodejs-users/
# Original language: typescript
# Normalized: ts
# Block index: 9

[label index.ts]
interface User {
  name: string;
}

function welcomeUser(user: User): string {
  return `Hello, ${user.name}!`;
}

console.log(welcomeUser({ name: "Alice" }));