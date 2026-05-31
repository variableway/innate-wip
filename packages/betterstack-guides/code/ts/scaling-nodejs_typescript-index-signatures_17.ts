# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-index-signatures/
# Original language: typescript
# Normalized: ts
# Block index: 17

interface MixedIndex {
  [key: string]: string | number;
  [index: number]: number;  // number is assignable to string | number
}