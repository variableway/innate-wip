# Source: https://betterstack.com/community/guides/scaling-nodejs/jiti-vs-ts-node-typescript/
# Original language: bash
# Normalized: sh
# Block index: 13

# Clean, simple execution
npx jiti app.ts

# Works identically for any module format
npx jiti app.mjs  # ESM
npx jiti app.js   # CommonJS  
npx jiti app.ts   # TypeScript