# Source: https://betterstack.com/community/guides/scaling-nodejs/ts-utility-types/
# Original language: typescript
# Normalized: ts
# Block index: 6

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
[highlight]
  role: 'admin' | 'user' | 'guest' | 'moderator'; // Added new role
[/highlight]
};

// Utility types automatically derive from User
type CreateUserRequest = Pick<User, 'email' | 'name' | 'role'>;
type UpdateUserRequest = Pick<User, 'id' | 'email' | 'name' | 'avatar' | 'role'>;
type UserSummary = Pick<User, 'id' | 'name' | 'isActive'>;

// All derived types automatically include the new moderator role option!