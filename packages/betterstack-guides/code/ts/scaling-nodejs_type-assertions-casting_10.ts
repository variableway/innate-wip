# Source: https://betterstack.com/community/guides/scaling-nodejs/type-assertions-casting/
# Original language: typescript
# Normalized: ts
# Block index: 10

// Narrowing: general to specific
const element = document.body as HTMLBodyElement;

// Widening: specific to general  
const value: string = "hello" as unknown;