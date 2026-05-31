# Source: https://betterstack.com/community/guides/testing/nodejs-test-runner/
# Original language: javascript
# Normalized: js
# Block index: 8

[label tests/formatter.test.js]
import { formatFileSize } from "../formatter.js";
import { describe, it } from "node:test";
import assert from "node:assert";

describe("formatFileSize function", () => {
  it('should return "1.00 GB" for sizeBytes = 1073741824', () => {
    assert.strictEqual(formatFileSize(1073741824), "1.00 GB");
  });
});