# Source: https://betterstack.com/community/guides/scaling-nodejs/deno-vs-bun-typescript/
# Original language: typescript
# Normalized: ts
# Block index: 4

// api.ts - Full type checking and execution
interface User {
  id: number;
  name: string;
  email: string;
}

export async function createUser(userData: Omit<User, 'id'>): Promise<User> {
  const user: User = { id: Date.now(), ...userData };
  return user;
}