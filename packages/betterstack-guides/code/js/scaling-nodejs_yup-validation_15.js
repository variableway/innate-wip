# Source: https://betterstack.com/community/guides/scaling-nodejs/yup-validation/
# Original language: javascript
# Normalized: js
# Block index: 15

[label index.js]
import userSchema from './validation.js';

const invalidData = {
  username: 'j#',  // Too short and contains special characters
  email: 'invalid',  // Invalid format
  age: 16  // Under 18
};

async function inspectErrors() {
  try {
    await userSchema.validate(invalidData, { abortEarly: false });
    console.log('Valid data');
  } catch (error) {
    // Log the overall error structure
    console.log('Error object structure:');
    console.log(JSON.stringify({
      name: error.name,
      message: error.message,
      path: error.path,
      errors: error.errors,
      inner: error.inner.map(err => ({
        message: err.message,
        path: err.path,
        type: err.type
      }))
    }, null, 2));
    
    // Log details of the first error
    console.log('\nFirst validation error:');
    const firstError = error.inner[0];
    console.log(`- Path: ${firstError.path}`);
    console.log(`- Type: ${firstError.type}`);
    console.log(`- Message: ${firstError.message}`);
  }
}

inspectErrors();