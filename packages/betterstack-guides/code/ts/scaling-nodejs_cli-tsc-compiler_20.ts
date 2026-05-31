# Source: https://betterstack.com/community/guides/scaling-nodejs/cli-tsc-compiler/
# Original language: typescript
# Normalized: ts
# Block index: 20

[label src/hello.ts]
function greet(name: string): string {
[highlight]  return `Hello there, ${name}!`;[/highlight]
}

console.log(greet("World"));