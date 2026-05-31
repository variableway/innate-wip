# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-streams/
# Original language: javascript
# Normalized: js
# Block index: 6

[label transform-example.js]
const { Transform } = require('stream');
const fs = require('fs');

class ReverseTransform extends Transform {
 _transform(chunk, encoding, callback) {
   // Reverse the string in the chunk
   const reversed = chunk.toString().split('').reverse().join('');
   // Push the transformed data
   this.push(reversed);
   callback();
 }
}

// Create transform stream
const reverser = new ReverseTransform();

// Create readable and writable streams
const readStream = fs.createReadStream('input.txt');
const writeStream = fs.createWriteStream('reversed.txt');

// Pipe data through the transform stream
readStream
 .pipe(reverser)
 .pipe(writeStream);

writeStream.on('finish', () => {
 console.log('Transformation complete');
});