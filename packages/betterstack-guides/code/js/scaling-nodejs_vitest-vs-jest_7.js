# Source: https://betterstack.com/community/guides/scaling-nodejs/vitest-vs-jest/
# Original language: javascript
# Normalized: js
# Block index: 7

// Vitest snapshot
test('Button label', () => {
  const { getByRole } = render(<Button label="Submit" />);
  expect(getByRole('button').textContent).toMatchInlineSnapshot(`"Submit"`);
});