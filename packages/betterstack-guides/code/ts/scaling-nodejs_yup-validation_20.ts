# Source: https://betterstack.com/community/guides/scaling-nodejs/yup-validation/
# Original language: typescript
# Normalized: ts
# Block index: 20

[label validation.ts]
import * as yup from 'yup';

const userSchema = yup.object({
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
});

[highlight]
// Infer TypeScript type from the schema
type User = yup.InferType<typeof userSchema>;

export { userSchema, type User };
[/highlight]