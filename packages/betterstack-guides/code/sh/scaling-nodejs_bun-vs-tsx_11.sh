# Source: https://betterstack.com/community/guides/scaling-nodejs/bun-vs-tsx/
# Original language: bash
# Normalized: sh
# Block index: 11

# TSX TypeScript REPL
tsx
> interface User { name: string; id: number; }
> const user: User = { name: 'Alice', id: 1 }
> user.name                  # Full TypeScript support
'Alice'