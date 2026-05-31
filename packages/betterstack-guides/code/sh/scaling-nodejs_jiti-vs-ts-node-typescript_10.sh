# Source: https://betterstack.com/community/guides/scaling-nodejs/jiti-vs-ts-node-typescript/
# Original language: bash
# Normalized: sh
# Block index: 10

# ts-node needs external watch tools
nodemon --exec "ts-node src/app.ts"

# Or with custom watch scripts
npm install --save-dev nodemon
# Package.json: "dev": "nodemon -x ts-node src/app.ts"