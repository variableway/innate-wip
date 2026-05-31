# Source: https://betterstack.com/community/guides/scaling-nodejs/yup-validation/
# Original language: typescript
# Normalized: ts
# Block index: 24

const userInputSchema = yup.object({
  email: yup.string()
    .email()
    .transform(value => value.toLowerCase())
    .required(),
  
  name: yup.string()
    .transform(value => value.trim())
    .required(),
  
  phoneNumber: yup.string()
    .transform(value => value.replace(/\D/g, '')) // Remove non-digits
    .matches(/^\d{10}$/, 'Phone number must be 10 digits')
});