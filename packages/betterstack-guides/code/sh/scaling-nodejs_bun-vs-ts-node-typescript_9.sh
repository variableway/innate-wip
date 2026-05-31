# Source: https://betterstack.com/community/guides/scaling-nodejs/bun-vs-ts-node-typescript/
# Original language: bash
# Normalized: sh
# Block index: 9

# ts-node TypeScript testing integration
jest --preset ts-jest           # Mature Jest integration for TypeScript
mocha -r ts-node/register 'test/**/*.ts'  # Mocha with TypeScript support

# What this provides:
# - Full type checking during test execution
# - Detailed error reporting with TypeScript context
# - Extensive plugin ecosystem
# - Battle-tested debugging capabilities