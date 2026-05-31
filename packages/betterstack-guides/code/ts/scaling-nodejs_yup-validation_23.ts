# Source: https://betterstack.com/community/guides/scaling-nodejs/yup-validation/
# Original language: typescript
# Normalized: ts
# Block index: 23

// Base user schema with common fields
const baseUserSchema = yup.object({
  email: yup.string().email().required(),
  name: yup.string().required(),
  createdAt: yup.date().default(() => new Date())
});

// Extended schema for user registration
const registrationSchema = baseUserSchema.shape({
  password: yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .required(),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required()
});