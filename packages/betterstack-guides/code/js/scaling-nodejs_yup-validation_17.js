# Source: https://betterstack.com/community/guides/scaling-nodejs/yup-validation/
# Original language: javascript
# Normalized: js
# Block index: 17

[label index.js]
import userSchema from './validation.js';
[highlight]
// Helper function to transform Yup errors into field-based format
function formatYupErrors(error) {
  if (!error || !error.inner) return {};
  
  return error.inner.reduce((formattedErrors, err) => {
    if (!formattedErrors[err.path]) {
      formattedErrors[err.path] = err.message;
    }
    return formattedErrors;
  }, {});
}
[/highlight]

const invalidData = {
  username: 'j#',
  email: 'invalid',
  age: 16
};

async function inspectErrors() {
  try {
[highlight]
    const validData = await userSchema.validate(invalidData, { abortEarly: false });
    console.log('Valid data:', validData);
[/highlight]
  } catch (error) {
[highlight]
    const formattedErrors = formatYupErrors(error);
    console.log('Validation errors by field:');
    console.log(formattedErrors);
[/highlight]
  }
}

inspectErrors();