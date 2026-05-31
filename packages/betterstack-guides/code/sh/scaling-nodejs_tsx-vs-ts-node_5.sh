# Source: https://betterstack.com/community/guides/scaling-nodejs/tsx-vs-ts-node/
# Original language: bash
# Normalized: sh
# Block index: 5

# ts-node ESM requires explicit setup
node --loader ts-node/esm ./app.ts
# Or with newer Node.js versions
node --import ts-node/esm ./app.ts

# Additional tsconfig.json configuration needed
{
  "ts-node": {
    "esm": true
  }
}