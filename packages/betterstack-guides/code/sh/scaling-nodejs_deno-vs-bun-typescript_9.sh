# Source: https://betterstack.com/community/guides/scaling-nodejs/deno-vs-bun-typescript/
# Original language: bash
# Normalized: sh
# Block index: 9

# Deno: Built-in type checking
deno check main.ts             # Fast built-in TypeScript compiler
deno check jsr:@std/http       # Remote module type checking
deno check --doc              # Documentation type checking

# Bun: External type checking for accuracy
bun run main.ts               # Fast execution without type checking
bunx tsc --noEmit            # Separate type checking step
bunx tsc --watch --noEmit    # Watch mode type checking