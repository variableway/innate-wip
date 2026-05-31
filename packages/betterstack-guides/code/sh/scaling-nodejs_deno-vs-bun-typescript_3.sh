# Source: https://betterstack.com/community/guides/scaling-nodejs/deno-vs-bun-typescript/
# Original language: bash
# Normalized: sh
# Block index: 3

# Separated execution and type checking
bun run app.ts              # Fast execution without type checking
bunx tsc --noEmit          # External type validation