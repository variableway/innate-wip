# Source: https://betterstack.com/community/guides/scaling-nodejs/vitest-vs-jest/
# Original language: javascript
# Normalized: js
# Block index: 6

// Jest snapshot
test('Button renders correctly', () => {
  const tree = renderer.create(<Button label="Submit" />).toJSON();
  expect(tree).toMatchSnapshot();
});