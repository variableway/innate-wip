# Source: https://betterstack.com/community/guides/scaling-nodejs/tsx-vs-ts-node/
# Original language: bash
# Normalized: sh
# Block index: 7

# ts-node requires external watch utilities
nodemon --exec "ts-node src/server.ts"

# Or with custom configuration
npm install --save-dev nodemon
# package.json: "dev": "nodemon -x ts-node src/server.ts"