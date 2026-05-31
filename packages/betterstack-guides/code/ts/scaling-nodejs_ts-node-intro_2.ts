# Source: https://betterstack.com/community/guides/scaling-nodejs/ts-node-intro/
# Original language: typescript
# Normalized: ts
# Block index: 2

[label src/index.ts]
interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

function createUser(name: string, email: string): User {
  return {
    id: Math.floor(Math.random() * 1000),
    name,
    email,
    createdAt: new Date()
  };
}

const user = createUser('Alice Johnson', 'alice@example.com');
console.log('Created user:', user);