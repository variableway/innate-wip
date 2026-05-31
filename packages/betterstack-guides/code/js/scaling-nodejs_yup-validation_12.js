# Source: https://betterstack.com/community/guides/scaling-nodejs/yup-validation/
# Original language: javascript
# Normalized: js
# Block index: 12

[label validation.js]
import * as yup from 'yup';

const userSchema = yup.object({
  ...
  age: yup.number()
    .typeError('Age must be a number')
    .integer('Age must be a whole number')
    .min(18, 'You must be at least 18 years old')
    .required('Age is required'),
[highlight]  
  role: yup.string()
    .oneOf(['user', 'admin', 'moderator'], 'Invalid role selected')
    .default('user'),
  
  permissions: yup.array()
    .of(yup.string())
    .when('role', {
      is: 'admin',
      then: schema => schema
        .min(1, 'At least one permission is required for admin users')
        .required('Permissions are required for admin users'),
      otherwise: schema => schema
        .length(0, 'Permissions are only allowed for admin users')
    })
[/highlight]
});

export default userSchema;