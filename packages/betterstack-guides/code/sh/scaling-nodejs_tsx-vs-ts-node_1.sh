# Source: https://betterstack.com/community/guides/scaling-nodejs/tsx-vs-ts-node/
# Original language: bash
# Normalized: sh
# Block index: 1

# ts-node integrated type checking
npx ts-node ./application.ts      # Full type validation during execution

# Immediate type error feedback
npx ts-node problematic-code.ts
# Error: TS2322: Type 'number' is not assignable to type 'string'