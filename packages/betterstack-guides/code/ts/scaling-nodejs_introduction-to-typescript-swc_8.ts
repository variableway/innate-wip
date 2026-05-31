# Source: https://betterstack.com/community/guides/scaling-nodejs/introduction-to-typescript-swc/
# Original language: typescript
# Normalized: ts
# Block index: 8

// Your User interface
interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

// Your createUser method signature
async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User>