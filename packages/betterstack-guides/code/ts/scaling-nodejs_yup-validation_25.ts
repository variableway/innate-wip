# Source: https://betterstack.com/community/guides/scaling-nodejs/yup-validation/
# Original language: typescript
# Normalized: ts
# Block index: 25

// Add a custom method for password validation
yup.addMethod(yup.string, 'password', function (message = 'Password is not strong enough') {
  return this.min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain an uppercase letter')
    .matches(/[a-z]/, 'Password must contain a lowercase letter')
    .matches(/[0-9]/, 'Password must contain a number')
    .matches(/[^A-Za-z0-9]/, 'Password must contain a special character');
});

// Now you can use it in your schemas
const userSchema = yup.object({
  username: yup.string().required(),
  password: yup.string().password().required()
});