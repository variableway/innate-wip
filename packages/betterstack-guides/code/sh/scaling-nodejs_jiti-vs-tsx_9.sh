# Source: https://betterstack.com/community/guides/scaling-nodejs/jiti-vs-tsx/
# Original language: bash
# Normalized: sh
# Block index: 9

# TSX execution (no type checking)
tsx ./development-app.ts

# Separate type checking step
tsc --noEmit

# Recommended workflow: fast iteration + separate validation