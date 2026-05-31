# Source: https://betterstack.com/community/guides/testing/nodejs-test-runner/
# Original language: javascript
# Normalized: js
# Block index: 4

[label index.js]
import { formatFileSize } from './formatter.js';

if (process.argv.length > 2) {
  const sizeBytes = parseInt(process.argv[2]);
  const formattedSize = formatFileSize(sizeBytes);
  console.log(formattedSize);
} else {
  console.log(
    'Please provide the file size in bytes as a command-line argument.'
  );
}