# Source: https://betterstack.com/community/guides/scaling-nodejs/jiti-vs-ts-node-typescript/
# Original language: bash
# Normalized: sh
# Block index: 2

# ts-node requires explicit registration
node -r ts-node/register script.ts
# Or npx with full package name
npx ts-node script.ts