# Source: https://betterstack.com/community/guides/scaling-nodejs/cli-tsc-compiler/
# Original language: typescript
# Normalized: ts
# Block index: 5

[label hello.ts]
function greet(name: string): string {
  return `Hello, ${name}!`;
}

console.log(greet("World"));