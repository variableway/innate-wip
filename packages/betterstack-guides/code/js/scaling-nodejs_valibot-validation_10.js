# Source: https://betterstack.com/community/guides/scaling-nodejs/valibot-validation/
# Original language: javascript
# Normalized: js
# Block index: 10

[label index.js]
import { validatePerson } from './validator.js';

// Valid person data
const validPerson = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  age: 25
};

// Invalid person data
const invalidPerson = {
  name: 'Jo',
  email: 'not-an-email',
  age: 16
};

// Validate both examples
const validResult = validatePerson(validPerson);
const invalidResult = validatePerson(invalidPerson);

// Check results
console.log('Valid person result:', validResult.success);
if (validResult.success) {
  console.log('Validated data:', validResult.data);
}

console.log('Invalid person result:', invalidResult.success);
if (!invalidResult.success) {
  console.log('Validation errors:');
  invalidResult.errors.forEach(error => {
    console.log(`- ${error.field}: ${error.message}`);
  });
}