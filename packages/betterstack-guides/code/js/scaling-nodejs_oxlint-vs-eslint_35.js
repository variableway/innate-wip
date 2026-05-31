# Source: https://betterstack.com/community/guides/scaling-nodejs/oxlint-vs-eslint/
# Original language: javascript
# Normalized: js
# Block index: 35

import react from 'eslint-plugin-react';
import vue from 'eslint-plugin-vue';

export default [
  {
    files: ['**/*.jsx', '**/*.tsx'],
    plugins: { react },
    rules: {
      'react/jsx-key': 'error',
      'react/no-array-index-key': 'warn',
      'react/no-danger': 'error',
    },
  },
  {
    files: ['**/*.vue'],
    ...vue.configs['flat/recommended'],
  },
];