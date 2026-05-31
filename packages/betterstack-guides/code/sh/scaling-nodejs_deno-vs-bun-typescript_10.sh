# Source: https://betterstack.com/community/guides/scaling-nodejs/deno-vs-bun-typescript/
# Original language: bash
# Normalized: sh
# Block index: 10

# Deno REPL with full TypeScript support
deno
> const sum = (a: number, b: number): number => a + b;
> sum(5, 10)    # Full type checking and IntelliSense
15

# Bun REPL with fast TypeScript execution
bun repl
> const user: { name: string; age: number } = { name: "John", age: 30 };
> user.name     # Fast execution, basic TypeScript support
"John"