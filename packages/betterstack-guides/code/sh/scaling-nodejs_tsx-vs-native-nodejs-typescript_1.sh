# Source: https://betterstack.com/community/guides/scaling-nodejs/tsx-vs-native-nodejs-typescript/
# Original language: bash
# Normalized: sh
# Block index: 1

# Native Node.js watch mode with TypeScript
node --watch --experimental-strip-types server.ts

# Or in v23.6+ (where type stripping is default)
node --watch server.ts

# Features:
# - Built into Node.js (no external dependencies)
# - Automatic restarts on file changes
# - Works with all Node.js flags