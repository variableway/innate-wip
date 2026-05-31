# Source: https://betterstack.com/community/guides/scaling-nodejs/tsx-vs-native-nodejs-typescript/
# Original language: bash
# Normalized: sh
# Block index: 8

# TSX figures everything out automatically
tsx ./esm-module.mjs        # ESM
tsx ./typescript-app.ts     # TypeScript
tsx ./commonjs-legacy.js    # CommonJS
tsx ./mixed-project.ts      # Mixed imports work seamlessly