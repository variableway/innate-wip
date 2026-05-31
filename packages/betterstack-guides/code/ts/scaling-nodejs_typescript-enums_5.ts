# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-enums/
# Original language: typescript
# Normalized: ts
# Block index: 5

[label src/magic-values.ts]
[highlight]
// Define valid roles as an enum
enum UserRole {
  Admin = 'admin',
  Moderator = 'moderator',
  User = 'user'
}

enum Action {
  View = 'view',
  Edit = 'edit',
  Delete = 'delete'
}
[/highlight]

// Type-safe permission checking
[highlight]
function checkPermission(userRole: UserRole, action: Action): boolean {
  if (userRole === UserRole.Admin) return true;
  if (userRole === UserRole.Moderator && action === Action.Edit) return true;
[/highlight]
  return false;
}

[highlight]
const user = { role: UserRole.Admin };
[/highlight]

[highlight]
console.log('Can edit?', checkPermission(user.role, Action.Edit));
[/highlight]

// This would cause a compile error:
// checkPermission(user.role, 'edit'); // Type error!