# Source: https://betterstack.com/community/guides/scaling-nodejs/oxlint-explained/
# Original language: javascript
# Normalized: js
# Block index: 2

[label index.js]
import { readFileSync } from "fs";

// A function with some common issues for linting to catch
function processData(data) {
  let unused = "This variable is never used";
  
  if (data == null) {
    return [];
  }
  
  const results = data.map((item, index) => {
    return {id: index, value: item}
  })
  
  return results;
}

// Try to read a non-existent file
try {
  const data = readFileSync("nonexistent.json", "utf8");
  console.log(processData(JSON.parse(data)));
} catch(error) {
  console.error("Error reading file:", error.message);
}