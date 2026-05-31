# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-skiplibcheck/
# Original language: ts
# Normalized: ts
# Block index: 12

// Somewhere inside index.d.ts
declare function brokenFunction(arg: ThisTypeDoesNotExist): void;