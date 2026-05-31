# Source: https://betterstack.com/community/guides/testing/nodejs-test-runner/
# Original language: javascript
# Normalized: js
# Block index: 13

[label tests/formatter.test.js
 . . .
test("formatFileSize function", (t) => {
[highlight]
  test('should return "1.00 GB" for sizeBytes = 1073741824', () => {
[/highlight]
    assert.strictEqual(formatFileSize(1073741824), "1.00 GB");
  });
});