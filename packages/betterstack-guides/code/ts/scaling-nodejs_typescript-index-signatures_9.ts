# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-index-signatures/
# Original language: typescript
# Normalized: ts
# Block index: 9

function getUser(userId: string): string {
  return cache[userId] ?? "Unknown user";
}