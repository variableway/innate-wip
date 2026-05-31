# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-streams/
# Original language: javascript
# Normalized: js
# Block index: 3

[label file-write-stream.js]
const fs = require('fs');

// Create a writable stream
const writableStream = fs.createWriteStream('output.txt');

// Write data to the stream
writableStream.write('This is the first line\n');
writableStream.write('This is the second line\n');
writableStream.write('This is the third line\n');

// End the stream
writableStream.end('This is the final line\n');

writableStream.on('finish', () => {
 console.log('All data has been written');
});

writableStream.on('error', (error) => {
 console.error('Error writing to file:', error);
});