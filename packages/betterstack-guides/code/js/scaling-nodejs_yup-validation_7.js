# Source: https://betterstack.com/community/guides/scaling-nodejs/yup-validation/
# Original language: javascript
# Normalized: js
# Block index: 7

[label validation.js]
import * as yup from 'yup';

const userSchema = yup.object({
[highlight]
  username: yup.string()
    .min(3, 'Username must have at least 3 characters')
    .max(30, 'Username cannot exceed 30 characters')
    .matches(/^[a-zA-Z0-9]+$/, 'Username must only contain letters and numbers')
    .required('Username is required'),
  
  email: yup.string()
    .email('Please provide a valid email address')
    .required('Email is required'),
  
  age: yup.number()
    .typeError('Age must be a number')
    .integer('Age must be a whole number')
    .min(18, 'You must be at least 18 years old')
    .required('Age is required'),
[/highlight]
});

export default userSchema;