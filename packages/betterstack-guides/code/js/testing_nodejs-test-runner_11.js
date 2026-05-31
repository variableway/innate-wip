# Source: https://betterstack.com/community/guides/testing/nodejs-test-runner/
# Original language: javascript
# Normalized: js
# Block index: 11

[label tests/formatter.test.js]
import { formatFileSize } from '../formatter.js';
import { test } from 'node:test';
import assert from 'node:assert';

test('formatFileSize function', (t) => {
  t.test('should return "1.00 GB" for sizeBytes = 1073741824', () => {
    assert.strictEqual(formatFileSize(1073741824), '1.00 GB');
  });
});