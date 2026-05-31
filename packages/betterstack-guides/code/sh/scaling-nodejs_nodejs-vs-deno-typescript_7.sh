# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-vs-deno-typescript/
# Original language: bash
# Normalized: sh
# Block index: 7

# Node.js requires separate tools
node app.ts                    # Execution only
npx prettier --write "**/*.ts" # External formatting
npx eslint "**/*.ts"          # External linting
npm test                      # External testing