# Source: https://betterstack.com/community/guides/scaling-nodejs/bun-vs-nodejs-typescript/
# Original language: bash
# Normalized: sh
# Block index: 0

# Bun watch capabilities
bun --watch app.ts               # Fast process restart
bun --hot server.ts              # Revolutionary hot reloading

# Hot mode features:
# - Preserves application state
# - HTTP servers stay running
# - Global variables maintained
# - Near-instantaneous code updates