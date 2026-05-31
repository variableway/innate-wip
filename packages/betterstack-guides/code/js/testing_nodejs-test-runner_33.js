# Source: https://betterstack.com/community/guides/testing/nodejs-test-runner/
# Original language: javascript
# Normalized: js
# Block index: 33

/* node:coverage disable */
if (anAlwaysFalseCondition) {
  console.log('this is never executed');
}
/* node:coverage enable */