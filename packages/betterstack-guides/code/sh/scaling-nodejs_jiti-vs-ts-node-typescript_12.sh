# Source: https://betterstack.com/community/guides/scaling-nodejs/jiti-vs-ts-node-typescript/
# Original language: bash
# Normalized: sh
# Block index: 12

# ts-node execution requires flags
node -r ts-node/register app.ts

# Or npx with full package name
npx ts-node app.ts

# ESM requires even more complex flags
node --loader ts-node/esm app.ts