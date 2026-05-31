# Source: https://betterstack.com/community/guides/scaling-nodejs/prettier-vs-eslint/
# Original language: bash
# Normalized: sh
# Block index: 5

# Check files for issues
npx eslint src/

# Fix automatically fixable issues
npx eslint src/ --fix