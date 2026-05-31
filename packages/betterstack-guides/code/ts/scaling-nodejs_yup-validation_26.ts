# Source: https://betterstack.com/community/guides/scaling-nodejs/yup-validation/
# Original language: typescript
# Normalized: ts
# Block index: 26

// Create schemas once at the module level
const loginSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required()
}).strict();

const userProfileSchema = yup.object({
  name: yup.string().required(),
  bio: yup.string().max(500)
}).strict();

// Reuse them for multiple validations
export function validateLogin(data) {
  return loginSchema.validate(data);
}

export function validateProfile(data) {
  return userProfileSchema.validate(data);
}