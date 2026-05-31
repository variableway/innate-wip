# Source: https://betterstack.com/community/guides/scaling-nodejs/biome-eslint/
# Original language: javascript
# Normalized: js
# Block index: 26

import security from 'eslint-plugin-security';
import noSecrets from 'eslint-plugin-no-secrets';

export default [
  {
    plugins: {
      security,
      'no-secrets': noSecrets
    },
    rules: {
      'security/detect-object-injection': 'warn',
      'security/detect-non-literal-regexp': 'warn',
      'security/detect-unsafe-regex': 'error',
      'no-secrets/no-secrets': 'error'
    }
  }
];