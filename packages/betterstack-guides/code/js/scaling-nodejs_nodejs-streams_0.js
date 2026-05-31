# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-streams/
# Original language: javascript
# Normalized: js
# Block index: 0

[label file-read-stream.js]
const fs = require('fs');

// Create a readable stream
const readableStream = fs.createReadStream('large-file.txt', {
 encoding: 'utf8',
 highWaterMark: 16 * 1024 // 16KB chunks
});

// Handle stream events
readableStream.on('data', (chunk) => {
 console.log(`Received ${chunk.length} characters`);
});

readableStream.on('end', () => {
 console.log('File reading completed');
});

readableStream.on('error', (error) => {
 console.error('Error reading file:', error);
});