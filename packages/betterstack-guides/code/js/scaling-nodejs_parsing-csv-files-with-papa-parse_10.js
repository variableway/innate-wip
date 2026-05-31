# Source: https://betterstack.com/community/guides/scaling-nodejs/parsing-csv-files-with-papa-parse/
# Original language: javascript
# Normalized: js
# Block index: 10

[label to-json.js]
import fs from 'node:fs';
import Papa from 'papaparse';

// Create read and write streams
const input = fs.createReadStream('employees.csv');
const output = fs.createWriteStream('employees.json');

// Track whether we're writing the first row
let isFirstRow = true;

// Write the opening bracket for the JSON array
output.write('[\n');

// Set up Papa Parse stream processor
const parseStream = Papa.parse(Papa.NODE_STREAM_INPUT, {
  header: true,
  dynamicTyping: true,
  skipEmptyLines: true,
});

// Handle each parsed row
parseStream.on('data', (row) => {
  const json = JSON.stringify(row, null, 2);
  const prefix = isFirstRow ? '' : ',\n';
  output.write(prefix + json);
  isFirstRow = false;
});

// Handle stream completion
parseStream.on('finish', () => {
  // Write the closing bracket of the JSON array
  output.write('\n]\n');
  output.end();
  console.log('CSV successfully converted to JSON using streaming.');
});

// Pipe input CSV stream into Papa Parse
input.pipe(parseStream);

// Optional: track file stream lifecycle
input.on('open', () => console.log('File opened for reading'));
input.on('end', () => console.log('CSV reading completed'));