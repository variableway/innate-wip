# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-enums/
# Original language: typescript
# Normalized: ts
# Block index: 3

[label src/magic-values.ts]
// User management with magic strings everywhere
function checkPermission(userRole: string, action: string): boolean {
  if (userRole === 'admin') return true;
  if (userRole === 'moderator' && action === 'edit') return true;
  return false;
}

// Different parts of code use different conventions
const user1 = { role: 'admin' };
const user2 = { role: 'Admin' }; // Capital A - bug!

console.log(checkPermission(user1.role, 'edit')); // true
console.log(checkPermission(user2.role, 'edit')); // false - case mismatch!