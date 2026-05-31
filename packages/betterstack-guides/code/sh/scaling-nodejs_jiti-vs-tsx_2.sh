# Source: https://betterstack.com/community/guides/scaling-nodejs/jiti-vs-tsx/
# Original language: bash
# Normalized: sh
# Block index: 2

# TSX as drop-in Node.js replacement
tsx --inspect --env-file=.env --no-warnings ./app.ts

# All Node.js flags work identically
tsx --experimental-modules --loader ./custom-loader.js ./script.ts