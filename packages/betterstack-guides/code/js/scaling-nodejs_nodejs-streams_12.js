# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-streams/
# Original language: javascript
# Normalized: js
# Block index: 12

[label csv-parser.js]
const { Transform } = require('stream');
const fs = require('fs');

class CSVParser extends Transform {
 constructor(options = {}) {
   options.objectMode = true;
   super(options);
   this.headers = null;
   this.buffer = '';
   this.delimiter = options.delimiter || ',';
 }

 _transform(chunk, encoding, callback) {
   // Add new data to the buffer
   this.buffer += chunk.toString();

   // Split on newlines
   const lines = this.buffer.split('\n');

   // Last line might be incomplete, save for next chunk
   this.buffer = lines.pop();

   // Process lines
   for (const line of lines) {
     // Skip empty lines
     if (line.trim() === '') continue;

     // Parse the CSV line
     const values = this._parseLine(line);

     // Extract headers from the first line
     if (!this.headers) {
       this.headers = values;
       continue;
     }

     // Convert arrays to objects using headers as keys
     const record = {};
     for (let i = 0; i < this.headers.length; i++) {
       record[this.headers[i]] = values[i];
     }

     // Push the parsed record
     this.push(record);
   }

   callback();
 }

 _flush(callback) {
   // Process any remaining data
   if (this.buffer.trim() !== '') {
     const values = this._parseLine(this.buffer);

     if (this.headers) {
       const record = {};
       for (let i = 0; i < this.headers.length; i++) {
         record[this.headers[i]] = values[i];
       }
       this.push(record);
     }
   }

   callback();
 }

 _parseLine(line) {
   // Very basic CSV parsing (doesn't handle quoted fields properly)
   return line.split(this.delimiter).map(field => field.trim());
 }
}

// Usage example
const parser = new CSVParser();
const readStream = fs.createReadStream('data.csv');

readStream.pipe(parser);

parser.on('data', (record) => {
 console.log(record);
});

parser.on('end', () => {
 console.log('CSV parsing complete');
});