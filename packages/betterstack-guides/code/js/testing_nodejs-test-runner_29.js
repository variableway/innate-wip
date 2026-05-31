# Source: https://betterstack.com/community/guides/testing/nodejs-test-runner/
# Original language: javascript
# Normalized: js
# Block index: 29

[label tests/index.test.js]
import { describe, it, mock, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';

describe('Mocking fs.readFile in Node.js', () => {
  beforeEach(() => {
    // Set up mocks or any necessary setup before each test
    mock.method(fs.promises, 'readFile', async () => 'Hello World');
  });

  afterEach(() => {
    // Clean up mocks or any other resources after each test
    mock.reset();
  });

  it('should successfully read the content of a text file', async () => {
    assert.strictEqual(fs.promises.readFile.mock.calls.length, 0);
    assert.strictEqual(
      await fs.promises.readFile('text-content.txt'),
      'Hello World'
    );
    assert.strictEqual(fs.promises.readFile.mock.calls.length, 1);
  });
});