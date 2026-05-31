# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-interfaces/
# Original language: typescript
# Normalized: ts
# Block index: 14

interface Timestamped {
  createdAt: Date;
  updatedAt: Date;
}

interface Identifiable {
  id: string;
}

interface User extends Person, Timestamped, Identifiable {
  role: string;
}