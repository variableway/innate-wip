# Source: https://betterstack.com/community/guides/scaling-nodejs/oxlint-vs-eslint/
# Original language: javascript
# Normalized: js
# Block index: 21

import importPlugin from 'eslint-plugin-import';

export default [
  {
    plugins: {
      import: importPlugin,
    },
    rules: {
      'import/no-cycle': 'error',
    },
  },
];