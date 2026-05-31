# Source: https://betterstack.com/community/guides/scaling-nodejs/yup-vs-zod/
# Original language: typescript
# Normalized: ts
# Block index: 9

// Derive the type directly from the schema
type User = z.infer<typeof userSchema>;

// Use in a function with perfect type alignment
function processUser(input: unknown): User {
  // Validation and type narrowing happen together
  return userSchema.parse(input);
}