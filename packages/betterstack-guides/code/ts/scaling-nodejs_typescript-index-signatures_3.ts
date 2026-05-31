# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-index-signatures/
# Original language: typescript
# Normalized: ts
# Block index: 3

[label src/problem.ts]
interface UserCache {
  // How do we type dynamic user IDs?
}

const cache: UserCache = {};

function cacheUser(userId: string, name: string) {
  cache[userId] = name;  // Error: no index signature
}

function getUser(userId: string): string {
  return cache[userId];  // Error: no index signature
}

cacheUser("user_123", "Alice");
cacheUser("user_456", "Bob");

console.log(getUser("user_123"));
console.log(getUser("user_456"));