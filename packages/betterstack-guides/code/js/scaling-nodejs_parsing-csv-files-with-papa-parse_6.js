# Source: https://betterstack.com/community/guides/scaling-nodejs/parsing-csv-files-with-papa-parse/
# Original language: javascript
# Normalized: js
# Block index: 6

[label app.js]
import { readFile } from 'fs/promises';
import Papa from 'papaparse';

async function parseCSV() {
  // Read and parse in one function
  const fileContent = await readFile('employees.csv', 'utf8');
[highlight]
  const { data, meta } = Papa.parse(fileContent, {
[/highlight]
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true
  });
  
[highlight]
  // Calculate total salary
  const totalSalary = data.reduce((sum, employee) => sum + employee.salary, 0);
  const averageSalary = totalSalary / data.length;
  
  // Find high earners
  const highEarners = data.filter(employee => employee.salary > 80000);
  
  // Print summary data
  console.log(`Total employees: ${data.length}`);
  console.log(`Average salary: $${averageSalary.toFixed(2)}`);
  console.log(`Number of high earners: ${highEarners.length}`);
  
  // List high earners
  console.log("\nHigh earners:");
  highEarners.forEach(employee => {
    console.log(`- ${employee.name} ($${employee.salary})`);
  });
[/highlight]
}

parseCSV().catch(console.error);