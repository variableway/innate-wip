# Source: https://betterstack.com/community/guides/scaling-nodejs/tsx-vs-native-nodejs-typescript/
# Original language: bash
# Normalized: sh
# Block index: 13

# Same command works everywhere
node --experimental-transform-types app.ts    # Development
NODE_ENV=production node app.ts               # Production (v23.6+)

# Or compile if preferred
tsc && node app.js                            # Traditional approach