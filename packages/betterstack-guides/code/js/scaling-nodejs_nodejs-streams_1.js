# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-streams/
# Original language: javascript
# Normalized: js
# Block index: 1

[label custom-readable.js]
const { Readable } = require('stream');

class CounterStream extends Readable {
 constructor(max) {
   super();
   this.max = max;
   this.counter = 0;
 }

 _read() {
   this.counter += 1;

   if (this.counter <= this.max) {
     // Convert to string because streams work with strings or Buffers
     const str = `${this.counter}\n`;
     this.push(str);
   } else {
     // Pushing null signals the end of the stream
     this.push(null);
   }
 }
}

const counterStream = new CounterStream(10);

counterStream.on('data', (chunk) => {
 console.log(chunk.toString());
});

counterStream.on('end', () => {
 console.log('Counter stream finished');
});