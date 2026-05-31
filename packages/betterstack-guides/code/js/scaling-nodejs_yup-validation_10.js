# Source: https://betterstack.com/community/guides/scaling-nodejs/yup-validation/
# Original language: javascript
# Normalized: js
# Block index: 10

[label index.js]
import userSchema from './validation.js';

const invalidUserData = {
  username: 'j#',
  email: 'not-an-email',
  age: 16
};

async function validateUser() {
  try {
[highlight]
    const validData = await userSchema.validate(invalidUserData, { 
      abortEarly: false 
    });
[/highlight]
    console.log('Valid user data:', validData);
  } catch (error) {
    console.error('Validation errors:');
[highlight]
    error.inner.forEach(err => {
      console.error(`- ${err.path}: ${err.message}`);
    });
[/highlight]
  }
}

validateUser();