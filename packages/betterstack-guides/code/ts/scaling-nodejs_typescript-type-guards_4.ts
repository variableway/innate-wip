# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-type-guards/
# Original language: typescript
# Normalized: ts
# Block index: 4

[label src/unsafe-types.ts]
// API returns union type - could be success or error
type ApiResponse = 
  | { success: true; data: { id: string; name: string } }
  | { success: false; error: string };

function processResponse(response: ApiResponse) {
  // Unsafe: assumes success without checking
  const data = (response as any).data;
  console.log(`Processing user: ${data.name}`);
  return data.id;
}

// Test with both response types
const successResponse: ApiResponse = {
  success: true,
  data: { id: '123', name: 'Alice' }
};

const errorResponse: ApiResponse = {
  success: false,
  error: 'User not found'
};

console.log(processResponse(successResponse));
console.log(processResponse(errorResponse)); // Runtime error!