# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-streams/
# Original language: javascript
# Normalized: js
# Block index: 9

[label stream-pipeline.js]
const fs = require('fs');
const zlib = require('zlib');
const { pipeline, Transform } = require('stream');

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

// Build the pipeline with error handling
pipeline(
 readStream,
 uppercaseStream,
 gzipStream,
 writeStream,
 (err) => {
   if (err) {
     console.error('Pipeline failed:', err);
   } else {
     console.log('Pipeline succeeded');
   }
 }
);