# Source: https://betterstack.com/community/guides/testing/nodejs-test-runner/
# Original language: javascript
# Normalized: js
# Block index: 20

[label tests/formatter.test.js]
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { formatFileSize } from '../formatter.js';

describe('formatFileSize function', () => {
[highlight]
  it.skip("should return '0B' for sizeBytes = 0", () => {
[/highlight]
    assert.strictEqual(formatFileSize(0), '0B');
  });

  . . .
});