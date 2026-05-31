# Source: https://betterstack.com/community/guides/scaling-nodejs/husky-and-lint-staged/
# Original language: javascript
# Normalized: js
# Block index: 17

[label src/test.js]
export function badFunction(){
  const unused = 'this will cause issues';
  console.log('hello')
}