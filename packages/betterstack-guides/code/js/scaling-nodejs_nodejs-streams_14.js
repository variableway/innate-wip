# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-streams/
# Original language: javascript
# Normalized: js
# Block index: 14

[label backpressure-example.js]
const fs = require('fs');
const writeStream = fs.createWriteStream('output.txt');

// Function to write a lot of data
function writeData(writer, data) {
 let i = 100000;
 write();

 function write() {
   let ok = true;
   do {
     i--;
     if (i === 0) {
       // Last write
       writer.write(data + '\n');
     } else {
       // Check if we should continue
       ok = writer.write(data + '\n');
     }
   } while (i > 0 && ok);

   if (i > 0) {
     // Wait for the drain event before continuing
     writer.once('drain', write);
   }
 }
}

writeData(writeStream, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.');