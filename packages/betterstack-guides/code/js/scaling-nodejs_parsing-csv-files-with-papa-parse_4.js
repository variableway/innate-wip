# Source: https://betterstack.com/community/guides/scaling-nodejs/parsing-csv-files-with-papa-parse/
# Original language: javascript
# Normalized: js
# Block index: 4

[label app.js]
import { readFile } from 'fs/promises';
import Papa from 'papaparse';

async function parseCSV() {
  // Read the file content
  const fileContent = await readFile('employees.csv', 'utf8');
  
  // Parse CSV string to objects
  const result = Papa.parse(fileContent, {
    header: true,         // First row contains headers
    skipEmptyLines: true, // Skip blank lines
    dynamicTyping: true   // Convert numbers and booleans
  });
  
  // Print the headers
  console.log(`Headers: ${result.meta.fields}`);
  
  // Print each row
  result.data.forEach(row => {
    console.log(`Employee: ${row.name} works in ${row.department} earning $${row.salary}`);
  });
}

parseCSV().catch(console.error);