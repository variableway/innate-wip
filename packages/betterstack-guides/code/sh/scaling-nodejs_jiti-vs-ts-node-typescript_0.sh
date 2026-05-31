# Source: https://betterstack.com/community/guides/scaling-nodejs/jiti-vs-ts-node-typescript/
# Original language: bash
# Normalized: sh
# Block index: 0

# ts-node ESM requires complex setup
node --loader ts-node/esm ./app.ts
# Or with newer Node.js versions
node --import ts-node/esm ./app.ts