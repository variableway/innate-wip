# Source: https://betterstack.com/community/guides/scaling-nodejs/bun-vs-ts-node-typescript/
# Original language: bash
# Normalized: sh
# Block index: 8

# Bun TypeScript testing
bun test                         # Finds and runs .ts test files automatically
bun test --watch                 # Instant feedback on TypeScript test changes
bun test --coverage              # Coverage reports for TypeScript source

# What this means for your workflow:
# - No jest.config.js or test setup
# - TypeScript tests run at native speed
# - Built-in mocking works with TypeScript modules