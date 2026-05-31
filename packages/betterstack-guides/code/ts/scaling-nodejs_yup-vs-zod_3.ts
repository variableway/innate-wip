# Source: https://betterstack.com/community/guides/scaling-nodejs/yup-vs-zod/
# Original language: typescript
# Normalized: ts
# Block index: 3

// Non-throwing alternative with safeParse
const result = addressSchema.safeParse(formData);
if (result.success) {
  saveAddress(result.data);
} else {
  displayErrors(result.error.format());
}