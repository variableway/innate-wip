# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-interfaces/
# Original language: typescript
# Normalized: ts
# Block index: 7

[label src/problem.ts]
[highlight]
interface User {
  name: string;
  email: string;
  age: number;
}
[/highlight]

[highlight]
function createUser(user: User) {
[/highlight]
  console.log(`Creating user: ${user.name}`);
  console.log(`Email: ${user.email}`);
  console.log(`Age: ${user.age}`);
  return { id: Math.random(), ...user };
}

....