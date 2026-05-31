# Source: https://betterstack.com/community/guides/scaling-nodejs/jiti-runtime/
# Original language: typescript
# Normalized: ts
# Block index: 4

[label example.ts]
interface User {
  name: string;
  age: number;
}

const user: User = {
  name: 'Alice',
  age: 30
};

function greetUser(user: User): string {
  return `Hello, ${user.name}! You are ${user.age} years old.`;
}

export default greetUser(user);