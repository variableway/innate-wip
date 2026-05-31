# Source: https://betterstack.com/community/guides/scaling-nodejs/jiti-vs-tsx/
# Original language: bash
# Normalized: sh
# Block index: 15

# TSX handles any module format effortlessly
tsx ./app.mjs    # Pure ESM
tsx ./app.ts     # TypeScript with ESM
tsx ./legacy.js  # CommonJS compatibility