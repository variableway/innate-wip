# Source: https://betterstack.com/community/guides/scaling-nodejs/vitest-vs-jest/
# Original language: javascript
# Normalized: js
# Block index: 0

// Jest example
test('displays username', () => {
  render(<UserProfile username="testuser" />);
  expect(screen.getByText('testuser')).toBeInTheDocument();
});