# Source: https://betterstack.com/community/guides/scaling-nodejs/biome-eslint/
# Original language: javascript
# Normalized: js
# Block index: 20

// packages/frontend/eslint.config.js
import baseConfig from '../../eslint.base.js';
import react from 'eslint-plugin-react';

export default [
  ...baseConfig,
  {
    files: ['**/*.{jsx,tsx}'],
    plugins: {
      react
    },
    rules: {
      ...react.configs.recommended.rules
    }
  }
];