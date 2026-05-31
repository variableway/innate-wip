# Source: https://betterstack.com/community/guides/scaling-nodejs/prettier-vs-eslint/
# Original language: bash
# Normalized: sh
# Block index: 1

# Format a specific file
npx prettier --write src/index.js

# Format all files in your project
npx prettier --write "src/**/*.{js,jsx,ts,tsx,json,css,scss}"