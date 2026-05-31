# Source: https://betterstack.com/community/guides/scaling-nodejs/deno-overview-for-nodejs-users/
# Original language: typescript
# Normalized: ts
# Block index: 16

[label app.ts]
interface User {
  name: string;
}

function welcomeUser(user: User): string {
  return `Hello, ${user.name}!`;
}

console.log(welcomeUser({ name: "Alice" }));