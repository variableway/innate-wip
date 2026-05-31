# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-vs-deno-typescript/
# Original language: bash
# Normalized: sh
# Block index: 6

# Deno's dedicated TypeScript REPL
deno
> interface User { name: string }
> const user: User = { name: "Alice" }
> user.name  // Full TypeScript intellisense