# Source: https://betterstack.com/community/guides/scaling-nodejs/tsx-vs-native-nodejs-typescript/
# Original language: typescript
# Normalized: ts
# Block index: 3

// Basic types work out of the box (v23.6+)
function greet(name: string): string {
  return `Hello, ${name}!`;
}

// Advanced features need explicit flags
enum Colors {  // Requires --experimental-transform-types
  Red = 'red',
  Blue = 'blue'
}

// Some features aren't supported yet
@decorator  // Parser error - not supported
class MyClass {}