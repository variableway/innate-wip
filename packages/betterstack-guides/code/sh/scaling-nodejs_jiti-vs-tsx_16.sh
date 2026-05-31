# Source: https://betterstack.com/community/guides/scaling-nodejs/jiti-vs-tsx/
# Original language: bash
# Normalized: sh
# Block index: 16

# Jiti automatically adapts to module formats
npx jiti ./modern-esm.mjs     # ESM modules
npx jiti ./typescript-app.ts  # TypeScript
npx jiti ./commonjs-lib.js    # Legacy CommonJS