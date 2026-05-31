# Source: https://betterstack.com/community/guides/scaling-nodejs/vitejs-explained/
# Original language: javascript
# Normalized: js
# Block index: 25

[label src/main.test.js]
import { describe, it, expect } from 'vitest'

describe('sample test', () => {
  it('adds numbers correctly', () => {
    expect(1 + 2).toBe(3);
  });
});