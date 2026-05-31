# Source: https://betterstack.com/community/guides/scaling-nodejs/biome-eslint/
# Original language: javascript
# Normalized: js
# Block index: 22

// packages/backend/eslint.config.js
export default [
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json'
      }
    },
    rules: {
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/require-await': 'error'
    }
  }
];