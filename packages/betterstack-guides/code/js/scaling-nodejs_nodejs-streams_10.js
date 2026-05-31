# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-streams/
# Original language: javascript
# Normalized: js
# Block index: 10

[label error-handling.js]
const fs = require('fs');
const { pipeline } = require('stream');

const readStream = fs.createReadStream('non-existent-file.txt');
const writeStream = fs.createWriteStream('output.txt');

// Method 1: Error events on individual streams
readStream.on('error', (err) => {
 console.error('Read error:', err.message);
});

writeStream.on('error', (err) => {
 console.error('Write error:', err.message);
});

// Method 2: Using pipeline for better error handling
pipeline(
 fs.createReadStream('another-non-existent-file.txt'),
 fs.createWriteStream('another-output.txt'),
 (err) => {
   if (err) {
     console.error('Pipeline error:', err.message);
   }
 }
);