# Source: https://betterstack.com/community/guides/scaling-nodejs/yup-validation/
# Original language: javascript
# Normalized: js
# Block index: 5

[label index.js]
import userSchema from './validation.js';

const userData = {
  username: 'johndoe',
  email: 'john.doe@example.com',
  age: 25
};

async function validateUser() {
  try {
    const validData = await userSchema.validate(userData);
    console.log('Valid user data:', validData);
  } catch (error) {
    console.error('Validation error:', error.message);
  }
}

validateUser();