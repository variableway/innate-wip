# Source: https://betterstack.com/community/guides/scaling-nodejs/oxlint-vs-eslint/
# Original language: javascript
# Normalized: js
# Block index: 30

// my-rule.js
import { defineRule } from 'oxlint';

export default defineRule({
  createOnce(context) {
    let consoleCount = 0;
    
    return {
      before() {
        consoleCount = 0;
      },
      CallExpression(node) {
        if (node.callee.object?.name === 'console') {
          consoleCount++;
          if (consoleCount > 3) {
            context.report({
              node,
              message: 'Too many console statements',
            });
          }
        }
      },
    };
  },
});