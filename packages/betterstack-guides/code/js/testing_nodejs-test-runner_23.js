# Source: https://betterstack.com/community/guides/testing/nodejs-test-runner/
# Original language: javascript
# Normalized: js
# Block index: 23

[label tests/index.test.js]
import { describe, it, mock } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';

// Mocking fs.readFile() method
mock.method(fs.promises, 'readFile', async () => 'Hello World');

describe('Mocking fs.readFile in Node.js', () => {
  it('should successfully read the content of a text file', async () => {
    assert.strictEqual(fs.promises.readFile.mock.calls.length, 0);
    assert.strictEqual(
      await fs.promises.readFile('text-content.txt'),
      'Hello World'
    );
    assert.strictEqual(fs.promises.readFile.mock.calls.length, 1);

    // Reset the globally tracked mocks.
    mock.reset();
  });
});