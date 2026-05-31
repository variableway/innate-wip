# Source: https://betterstack.com/community/guides/scaling-nodejs/oxlint-vs-eslint/
# Original language: javascript
# Normalized: js
# Block index: 4

[label eslint.config.js]
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      react,
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
    },
  },
];