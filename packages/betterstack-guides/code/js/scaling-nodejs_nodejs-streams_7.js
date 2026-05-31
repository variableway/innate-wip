# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-streams/
# Original language: javascript
# Normalized: js
# Block index: 7

[label basic-pipe.js]
const fs = require('fs');

const readStream = fs.createReadStream('source.txt');
const writeStream = fs.createWriteStream('destination.txt');

// Pipe the read stream into the write stream
readStream.pipe(writeStream);

writeStream.on('finish', () => {
 console.log('File copy completed');
});