# Source: https://betterstack.com/community/guides/scaling-nodejs/tsx-vs-ts-node/
# Original language: bash
# Normalized: sh
# Block index: 4

# TSX handles all module formats effortlessly
tsx ./modern-esm-app.mjs         # Pure ESM
tsx ./typescript-esm.ts          # TypeScript with ESM
tsx ./legacy-commonjs.js         # CommonJS compatibility
tsx ./mixed-modules.ts           # Mixed module environments