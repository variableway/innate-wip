# Source: https://betterstack.com/community/guides/scaling-nodejs/biome-eslint/
# Original language: bash
# Normalized: sh
# Block index: 1

# Install ESLint and TypeScript support
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin

# Install Prettier and integration
npm install --save-dev prettier eslint-config-prettier

# Install React plugin
npm install --save-dev eslint-plugin-react eslint-plugin-react-hooks

# Initialize ESLint
npx eslint --init