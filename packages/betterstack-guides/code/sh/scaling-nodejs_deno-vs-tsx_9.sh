# Source: https://betterstack.com/community/guides/scaling-nodejs/deno-vs-tsx/
# Original language: bash
# Normalized: sh
# Block index: 9

# Deno dedicated TypeScript REPL
deno
> interface User { name: string; email: string }
> const user: User = { name: "Alice", email: "alice@example.com" }
> user.name  // Full TypeScript intellisense and validation