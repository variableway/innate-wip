# Source: https://betterstack.com/community/guides/scaling-nodejs/yup-validation/
# Original language: javascript
# Normalized: js
# Block index: 19

try {
  const validData = userSchema.validateSync(data, { abortEarly: false });
  // Validation succeeded
} catch (error) {
  const formattedErrors = formatYupErrors(error);
  // Handle validation errors
}