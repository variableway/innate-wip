# Source: https://betterstack.com/community/guides/scaling-nodejs/prettier-vs-eslint/
# Original language: bash
# Normalized: sh
# Block index: 27

# Time prettier formatting a directory
time npx prettier --write src/
# real    0m1.234s

# Time eslint checking the same directory
time npx eslint src/
# real    0m5.678s