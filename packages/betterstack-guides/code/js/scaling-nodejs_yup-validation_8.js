# Source: https://betterstack.com/community/guides/scaling-nodejs/yup-validation/
# Original language: javascript
# Normalized: js
# Block index: 8

[label index.js]
import userSchema from './validation.js';

[highlight]
const invalidUserData = {
  username: 'j#',  // Too short and contains special characters
  email: 'not-an-email',  // Invalid format
  age: 16  // Under 18
};
[/highlight]

async function validateUser() {
  try {
[highlight]
    const validData = await userSchema.validate(invalidUserData);
[/highlight]
    console.log('Valid user data:', validData);
  } catch (error) {
    console.error('Validation error:', error.message);
  }
}

validateUser();