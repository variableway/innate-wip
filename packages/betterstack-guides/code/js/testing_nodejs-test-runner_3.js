# Source: https://betterstack.com/community/guides/testing/nodejs-test-runner/
# Original language: javascript
# Normalized: js
# Block index: 3

[label formatter.js]
function formatFileSize(sizeBytes) {
  if (sizeBytes === 0) {
    return '0B';
  }
  const sizeName = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(sizeBytes) / Math.log(1024));
  const p = Math.pow(1024, i);
  const s = (sizeBytes / p).toFixed(2);
  return `${s} ${sizeName[i]}`;
}

export { formatFileSize };