# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-generics/
# Original language: typescript
# Normalized: ts
# Block index: 4

function pair<K, V>(key: K, value: V): [K, V] {
  return [key, value];
}