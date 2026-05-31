# Source: https://betterstack.com/community/guides/scaling-nodejs/yup-vs-zod/
# Original language: typescript
# Normalized: ts
# Block index: 2

// Synchronous validation with options
try {
  const validData = addressSchema.validateSync(formData, {
    abortEarly: false, // Return all errors, not just the first one
    stripUnknown: true // Remove fields not defined in the schema
  });
  saveAddress(validData);
} catch (error) {
  displayErrors(error.errors);
}