# Source: https://betterstack.com/community/guides/scaling-nodejs/ts-utility-types/
# Original language: typescript
# Normalized: ts
# Block index: 3

[label src/problem.ts]
// Base user type from your API
type User = {
  id: string;
  email: string;
  name: string;
  avatar: string;
  createdAt: Date;
  lastLogin: Date;
  isActive: boolean;
  role: 'admin' | 'user' | 'guest';
};

// Manually duplicated types for different contexts
type CreateUserRequest = {
  email: string;
  name: string;
  role: 'admin' | 'user' | 'guest';
};

type UpdateUserRequest = {
  id: string;
  email: string;
  name: string;
  avatar: string;
  role: 'admin' | 'user' | 'guest';
};

type UserSummary = {
  id: string;
  name: string;
  isActive: boolean;
};

// What happens when User type changes?
// You need to manually update 3+ other types!