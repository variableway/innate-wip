# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-streams/
# Original language: javascript
# Normalized: js
# Block index: 8

[label pipeline-example.js]
const fs = require('fs');
const zlib = require('zlib');
const { Transform } = require('stream');

// Create a transform stream to convert to uppercase
class UppercaseTransform extends Transform {
 _transform(chunk, encoding, callback) {
   this.push(chunk.toString().toUpperCase());
   callback();
 }
}

// Create the streams
const readStream = fs.createReadStream('input.txt');
const uppercaseStream = new UppercaseTransform();
const gzipStream = zlib.createGzip();
const writeStream = fs.createWriteStream('output.txt.gz');

// Build the pipeline
readStream
 .pipe(uppercaseStream)  // First transform the data to uppercase
 .pipe(gzipStream)       // Then compress it
 .pipe(writeStream);     // Finally, write to a file

writeStream.on('finish', () => {
 console.log('Pipeline processing completed');
});