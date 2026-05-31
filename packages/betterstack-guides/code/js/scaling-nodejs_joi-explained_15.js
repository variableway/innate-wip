# Source: https://betterstack.com/community/guides/scaling-nodejs/joi-explained/
# Original language: javascript
# Normalized: js
# Block index: 15

[label index.js]
import userSchema from './validation.js';

const invalidData = {
  username: 'j@',  // Too short and contains special characters
  email: 'invalid',  // Invalid format
  age: 16  // Under 18
};

const result = userSchema.validate(invalidData, { abortEarly: false });

if (result.error) {
  // Log the full error object structure
  console.log('Error object structure:');
  console.log(JSON.stringify(result.error, null, 2).substring(0, 500) + '...');
  
  // Log details of the first error
  console.log('\nFirst error detail:');
  const firstError = result.error.details[0];
  console.log(`- Path: ${firstError.path.join('.')}`);
  console.log(`- Type: ${firstError.type}`);
  console.log(`- Message: ${firstError.message}`);
  console.log(`- Context:`, firstError.context);
}