# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-streams/
# Original language: javascript
# Normalized: js
# Block index: 2

[label paused-read.js]
const fs = require('fs');
const readableStream = fs.createReadStream('large-file.txt');

// Switch to paused mode if it was in flowing mode
readableStream.pause();

// Manually read chunks
process.stdin.on('data', () => {
 const chunk = readableStream.read(64);
 if (chunk) {
   console.log(`Read ${chunk.length} bytes:`, chunk.toString());
 } else {
   console.log('No more data to read at the moment');
 }
});

readableStream.on('end', () => {
 console.log('End of stream');
 process.exit(0);
});

console.log('Press enter to read 64 bytes');