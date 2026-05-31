# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-streams/
# Original language: javascript
# Normalized: js
# Block index: 15

[label pipe-backpressure.js]
const fs = require('fs');
const { Transform } = require('stream');

// Create a slow transform stream
class SlowTransform extends Transform {
 _transform(chunk, encoding, callback) {
   // Simulate slow processing
   setTimeout(() => {
     this.push(chunk);
     callback();
   }, 100);
 }
}

// Fast readable stream
const readStream = fs.createReadStream('large-file.txt', {
 highWaterMark: 1024 * 1024 // 1MB chunks
});

// Slow transform stream
const slowTransform = new SlowTransform({
 highWaterMark: 16 * 1024 // 16KB buffer
});

// Destination
const writeStream = fs.createWriteStream('output.txt');

// Pipe will handle backpressure automatically
readStream
 .pipe(slowTransform)
 .pipe(writeStream);

writeStream.on('finish', () => {
 console.log('All data processed');
});