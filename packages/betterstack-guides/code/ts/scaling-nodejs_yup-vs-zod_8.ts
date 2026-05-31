# Source: https://betterstack.com/community/guides/scaling-nodejs/yup-vs-zod/
# Original language: typescript
# Normalized: ts
# Block index: 8

// Define the TypeScript interface separately
interface User {
  id: number;
  name: string;
  email: string;
  // Additional fields...
}

// Use both schema and type in a function
function processUser(input: unknown): User {
  // Validate with schema
  const validData = userSchema.validateSync(input);
  
  // Type assertion needed to connect validation result to TypeScript type
  return validData as User;
}