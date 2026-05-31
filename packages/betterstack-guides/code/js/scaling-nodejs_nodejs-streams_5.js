# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-streams/
# Original language: javascript
# Normalized: js
# Block index: 5

[label duplex-example.js]
const { Duplex } = require('stream');

class NumberDuplex extends Duplex {
 constructor(options) {
   super(options);
   this.current = 0;
   this.max = 5;
   this.received = [];
 }

 _read() {
   this.current++;
   if (this.current <= this.max) {
     this.push(`${this.current}\n`);
   } else {
     this.push(null);
   }
 }

 _write(chunk, encoding, callback) {
   this.received.push(chunk.toString().trim());
   callback();
 }

 _final(callback) {
   console.log('Received messages:', this.received);
   callback();
 }
}

const duplex = new NumberDuplex();

// Read side
duplex.on('data', (chunk) => {
 console.log('Read:', chunk.toString());
});

duplex.on('end', () => {
 console.log('Read complete');
});

// Write side
duplex.write('a');
duplex.write('b');
duplex.write('c');
duplex.end();