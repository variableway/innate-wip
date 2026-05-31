# Source: https://betterstack.com/community/guides/scaling-nodejs/joi-explained/
# Original language: javascript
# Normalized: js
# Block index: 17

[label index.js]
import userSchema from './validation.js';
[highlight]
// Helper function to format Joi errors
function formatJoiErrors(error) {
  if (!error || !error.details) return {};

  return error.details.reduce((result, detail) => {
    const key = detail.path.join('.');
    
    // Only keep the first error for each field
    if (!result[key]) {
      result[key] = detail.message;
    }
    
    return result;
  }, {});
}
[/highlight]


const invalidData = {
  username: 'j@',
  email: 'invalid',
  age: 16
};

const result = userSchema.validate(invalidData, { abortEarly: false });

if (result.error) {
[highlight]
  const formattedErrors = formatJoiErrors(result.error);
  console.log('Validation errors by field:');
  console.log(formattedErrors);
} else {
  console.log('Valid data:', result.value);
}
[/highlight]