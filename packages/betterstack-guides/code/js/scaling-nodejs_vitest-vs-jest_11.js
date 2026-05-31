# Source: https://betterstack.com/community/guides/scaling-nodejs/vitest-vs-jest/
# Original language: javascript
# Normalized: js
# Block index: 11

// Vitest debugging
test.only('focus on this test', () => {
  console.log({ result });
  expect(result).toEqual(expected);
});