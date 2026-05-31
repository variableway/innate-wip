# Source: https://betterstack.com/community/guides/scaling-nodejs/biome-eslint/
# Original language: javascript
# Normalized: js
# Block index: 19

// eslint.config.js (root)
import baseConfig from './eslint.base.js';

export default [
  ...baseConfig,
  {
    ignores: ['**/dist', '**/node_modules']
  }
];