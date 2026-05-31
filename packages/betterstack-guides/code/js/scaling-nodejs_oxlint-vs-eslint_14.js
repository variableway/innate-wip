# Source: https://betterstack.com/community/guides/scaling-nodejs/oxlint-vs-eslint/
# Original language: javascript
# Normalized: js
# Block index: 14

export default [
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
    },
  },
];