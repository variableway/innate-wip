# Source: https://betterstack.com/community/guides/scaling-nodejs/jiti-vs-ts-node-typescript/
# Original language: bash
# Normalized: sh
# Block index: 1

# Jiti works with any module format out of the box
npx jiti ./app.ts    # TypeScript
npx jiti ./app.mjs   # ESM
npx jiti ./app.js    # CommonJS