# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-type-guards/
# Original language: typescript
# Normalized: ts
# Block index: 13

[label src/type-predicates.ts]
interface User {
  id: string;
  email: string;
  name: string;
}

interface AdminUser extends User {
  role: 'admin';
  permissions: string[];
}

// Custom type predicate
function isAdminUser(user: User): user is AdminUser {
  return 'role' in user && user.role === 'admin';
}

function processUser(user: User) {
  if (isAdminUser(user)) {
    // TypeScript knows user has permissions here
    console.log(`Admin ${user.name}: ${user.permissions.join(', ')}`);
  } else {
    console.log(`Regular user: ${user.name}`);
  }
}

// Test with different user types
const regularUser: User = {
  id: '1',
  email: 'alice@example.com',
  name: 'Alice'
};

const admin: AdminUser = {
  id: '2',
  email: 'bob@example.com',
  name: 'Bob',
  role: 'admin',
  permissions: ['read', 'write', 'delete']
};

processUser(regularUser);
processUser(admin);