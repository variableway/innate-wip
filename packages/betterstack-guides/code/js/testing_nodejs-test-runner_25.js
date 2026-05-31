# Source: https://betterstack.com/community/guides/testing/nodejs-test-runner/
# Original language: javascript
# Normalized: js
# Block index: 25

[label tests/index.test.js]
import { describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';

describe('Mocking setTimeout in Node.js', () => {
  it('should successfully mock setTimeout', () => {
    const fn = mock.fn();
    mock.timers.enable({ apis: ['setTimeout'] });
    setTimeout(fn, 20);

    mock.timers.tick(10);
    mock.timers.tick(10);

    assert.strictEqual(fn.mock.callCount(), 1);
  });
});