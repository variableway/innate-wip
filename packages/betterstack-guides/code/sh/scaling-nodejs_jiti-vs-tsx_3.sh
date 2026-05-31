# Source: https://betterstack.com/community/guides/scaling-nodejs/jiti-vs-tsx/
# Original language: bash
# Normalized: sh
# Block index: 3

# Jiti requires its own command pattern
npx jiti ./app.ts

# Node.js flags require different handling
JITI_DEBUG=1 npx jiti ./script.ts