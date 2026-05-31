# Source: https://betterstack.com/community/guides/scaling-nodejs/ts-utility-types/
# Original language: typescript
# Normalized: ts
# Block index: 5

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

[highlight]
// Replace the manually duplicated types with utility types
type CreateUserRequest = Pick<User, 'email' | 'name' | 'role'>;
type UpdateUserRequest = Pick<User, 'id' | 'email' | 'name' | 'avatar' | 'role'>;
type UserSummary = Pick<User, 'id' | 'name' | 'isActive'>;

// Test that the derived types work correctly
const createRequest: CreateUserRequest = {
  email: 'alice@example.com',
  name: 'Alice Johnson',
  role: 'user'
};

const userSummary: UserSummary = {
  id: '123',
  name: 'Alice Johnson',
  isActive: true
};

console.log('Create request:', createRequest);
console.log('User summary:', userSummary);
[/highlight]