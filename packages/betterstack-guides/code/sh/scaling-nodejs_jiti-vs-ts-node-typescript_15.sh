# Source: https://betterstack.com/community/guides/scaling-nodejs/jiti-vs-ts-node-typescript/
# Original language: bash
# Normalized: sh
# Block index: 15

# Zero configuration needed for basic usage
npx jiti app.ts

# Optional environment variables for advanced usage
JITI_DEBUG=1 JITI_FS_CACHE=false npx jiti app.ts