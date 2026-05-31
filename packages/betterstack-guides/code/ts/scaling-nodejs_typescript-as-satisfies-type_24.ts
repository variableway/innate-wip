# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-as-satisfies-type/
# Original language: typescript
# Normalized: ts
# Block index: 24

[label function-types.ts]
function processUser(user: User): UserDTO {
  return { id: user.id, name: user.name };
}