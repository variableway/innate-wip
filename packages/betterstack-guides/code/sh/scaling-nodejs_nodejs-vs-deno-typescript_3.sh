# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-vs-deno-typescript/
# Original language: bash
# Normalized: sh
# Block index: 3

# Node.js: fast execution without type checking
node app.ts

# Separate type checking step
tsc --noEmit
npx tsc --watch --noEmit  # Watch mode type checking