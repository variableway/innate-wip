# Source: https://betterstack.com/community/guides/scaling-nodejs/vitest-vs-jest/
# Original language: javascript
# Normalized: js
# Block index: 1

// Vitest example
import { test, expect, vi } from 'vitest';

test('handles empty data', () => {
  const consoleSpy = vi.spyOn(console, 'error');
  render(<UserProfile />);
  expect(consoleSpy).not.toHaveBeenCalled();
});