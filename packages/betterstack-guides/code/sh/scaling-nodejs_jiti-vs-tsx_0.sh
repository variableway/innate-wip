# Source: https://betterstack.com/community/guides/scaling-nodejs/jiti-vs-tsx/
# Original language: bash
# Normalized: sh
# Block index: 0

# TSX provides native TypeScript REPL
tsx
> const user: { name: string } = { name: 'Alice' }
> user.name // Full TypeScript support in interactive mode
> // IntelliSense and type checking work seamlessly