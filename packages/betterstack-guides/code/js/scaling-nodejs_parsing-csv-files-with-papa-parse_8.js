# Source: https://betterstack.com/community/guides/scaling-nodejs/parsing-csv-files-with-papa-parse/
# Original language: javascript
# Normalized: js
# Block index: 8

[label stream.js]
import fs from "node:fs";
import Papa from "papaparse";

// Create a readable stream from the CSV file
const fileStream = fs.createReadStream("employees.csv");

// Set up Papa Parse stream processor
const parseStream = Papa.parse(Papa.NODE_STREAM_INPUT, {
  header: true,
  dynamicTyping: true,
});

// Process data as it comes in
parseStream.on("data", (row) => {
  // Each row is already an object with properties from headers
  console.log(`Employee: ${row.name} works in ${row.department} earning $${row.salary}`);
  
  // You can perform any processing on each row here
  if (row.salary > 80000) {
    console.log(`High earner found: ${row.name} ($${row.salary})`);
  }
});

// Track processing events
parseStream.on("finish", () => {
  console.log("Parsing finished");
});

// Connect the file stream to the Papa Parse stream
fileStream.pipe(parseStream);

// Add file stream event handlers
fileStream.on("open", () => console.log("File opened"));
fileStream.on("end", () => console.log("File reading completed"));