# Source: https://betterstack.com/community/guides/scaling-nodejs/biome-eslint/
# Original language: javascript
# Normalized: js
# Block index: 4

import jsxA11y from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';

export default [
  {
    plugins: {
      'jsx-a11y': jsxA11y,
      'import': importPlugin
    },
    rules: {
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/aria-props': 'error',
      'jsx-a11y/aria-role': 'error',
      'import/no-restricted-paths': ['error', {
        zones: [
          {
            target: './src/packages/core',
            from: './src/packages/plugins'
          }
        ]
      }],
      'import/order': ['error', {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
        alphabetize: { order: 'asc' }
      }]
    }
  }
];