# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-index-signatures/
# Original language: typescript
# Normalized: ts
# Block index: 7

[label src/problem.ts]
interface UserCache {
  [highlight]
  [userId: string]: string;
  [/highlight]
}

const cache: UserCache = {};

function cacheUser(userId: string, name: string) {
  cache[userId] = name;
}

[highlight]
function getUser(userId: string):string | undefined {
[/highlight]
  return cache[userId];
}

...