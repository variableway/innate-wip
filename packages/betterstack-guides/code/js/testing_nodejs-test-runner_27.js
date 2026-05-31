# Source: https://betterstack.com/community/guides/testing/nodejs-test-runner/
# Original language: javascript
# Normalized: js
# Block index: 27

[label tests/index.test.js]
import assert from 'node:assert';
import { describe, it, test } from 'node:test';

describe('Mocking the Date object in Node.js', () => {
  it('should effectively mock the Date object starting from 200 milliseconds', (context) => {
    context.mock.timers.enable({ apis: ['Date'], now: 200 });
    assert.strictEqual(Date.now(), 200);

    // Simulate advancing time by 200 milliseconds
    context.mock.timers.tick(200);
    assert.strictEqual(Date.now(), 400);
  });
});