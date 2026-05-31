# Source: https://betterstack.com/community/guides/scaling-nodejs/ts-utility-types/
# Original language: typescript
# Normalized: ts
# Block index: 12

[label src/essential-utils.ts]
type User = {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
};

// Partial - makes all properties optional (perfect for updates)
type UserUpdate = Partial<User>;
const update: UserUpdate = { name: 'New Name' }; // Only name needed

// Required - makes all properties required
type CompleteUser = Required<User>; // All fields must be present

// Record - creates consistent key-value mappings
type UserPermissions = Record<string, boolean>;
const permissions: UserPermissions = {
  'read': true,
  'write': false,
  'delete': true
};

// ReturnType - extracts function return types
function createUser(data: User) {
  return { user: data, created: new Date() };
}
type CreateUserResult = ReturnType<typeof createUser>;

// Test the utility types
const userUpdate: UserUpdate = { email: 'newemail@example.com' };
const userResult: CreateUserResult = createUser({
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  isActive: true
});

console.log('Update:', userUpdate);
console.log('Created:', userResult);