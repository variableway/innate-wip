# Source: https://betterstack.com/community/guides/scaling-nodejs/type-assertions-casting/
# Original language: typescript
# Normalized: ts
# Block index: 15

[label src/double.ts]
const value = "hello";

// This fails - string and number are unrelated
// const num = value as number;

// Double assertion forces it through
const num = value as unknown as number;

// TypeScript now thinks num is a number
console.log("Type:", typeof num);
console.log("Value:", num);

// This compiles but crashes at runtime
// console.log(num.toFixed(2));