# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-index-signatures/
# Original language: typescript
# Normalized: ts
# Block index: 18

interface InvalidMixed {
  [key: string]: number;
  [index: number]: string;  // Error: string not assignable to number
}