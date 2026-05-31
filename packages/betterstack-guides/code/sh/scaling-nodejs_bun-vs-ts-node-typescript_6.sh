# Source: https://betterstack.com/community/guides/scaling-nodejs/bun-vs-ts-node-typescript/
# Original language: bash
# Normalized: sh
# Block index: 6

# ts-node feature-rich TypeScript REPL
npx ts-node
> interface User { name: string; age: number; }
> const user: User = { name: 'Alice', age: 30 }
> user.name    # IntelliSense suggests properties
'Alice'
> user.age = 'thirty'  # Immediate, helpful error feedback
# Error: Type 'string' is not assignable to type 'number'