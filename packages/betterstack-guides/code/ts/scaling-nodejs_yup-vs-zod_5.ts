# Source: https://betterstack.com/community/guides/scaling-nodejs/yup-vs-zod/
# Original language: typescript
# Normalized: ts
# Block index: 5

const confirmPassword = yup.string()
  .required('Please confirm your password')
  .test(
    'passwords-match',
    'Passwords must match',
    function(value) {
      return this.parent.newPassword === value;
    }
  );