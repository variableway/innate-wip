# Source: https://betterstack.com/community/guides/scaling-nodejs/bun-vs-ts-node-typescript/
# Original language: bash
# Normalized: sh
# Block index: 1

# ts-node TypeScript watch setup
nodemon --exec "ts-node src/server.ts"

# Or with ts-node-dev for optimized reloads
ts-node-dev src/server.ts

# What this provides:
# - Reliable TypeScript file monitoring
# - Full type checking on every restart
# - Clean slate with each change
# - Predictable, debuggable behavior