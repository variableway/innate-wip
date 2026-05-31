# Source: https://betterstack.com/community/guides/scaling-nodejs/introduction-to-typescript-swc/
# Original language: typescript
# Normalized: ts
# Block index: 11

[label src/index.ts]
const user = await userService.createUser({
  name: 'Alice Johnson',
  email: 'alice@example.com'
[highlight]
  // invalidProperty: true - removed to fix type error
[/highlight]
});