# Source: https://betterstack.com/community/guides/scaling-nodejs/bun-vs-ts-node-typescript/
# Original language: bash
# Normalized: sh
# Block index: 0

# Bun TypeScript watch capabilities
bun --watch app.ts               # Fast process restart for TypeScript
bun --hot server.ts              # Hot reloading with state preservation

# What this means in practice:
# - Your HTTP server keeps running during TypeScript changes
# - Database connections stay alive
# - In-memory state survives code updates
# - Zero downtime during development iterations