# Source: https://betterstack.com/community/guides/scaling-nodejs/bun-vs-nodejs-typescript/
# Original language: bash
# Normalized: sh
# Block index: 1

# Node.js watch capabilities
node --watch app.ts              # Clean process restarts
node --watch --experimental-transform-types complex.ts

# Features:
# - Built into Node.js core
# - Works with all Node.js flags
# - Consistent, predictable behavior