# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-type-guards/
# Original language: typescript
# Normalized: ts
# Block index: 7

[label src/unsafe-types.ts]
// API returns union type - could be success or error
type ApiResponse = 
  | { success: true; data: { id: string; name: string } }
  | { success: false; error: string };

[highlight]
function processResponse(response: ApiResponse) {
  // Type guard: check which variant we have
  if (response.success) {
    // TypeScript knows response.data exists here
    console.log(`Processing user: ${response.data.name}`);
    return response.data.id;
  } else {
    // TypeScript knows response.error exists here
    console.log(`Error: ${response.error}`);
    return null;
  }
}
[/highlight]

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
console.log(processResponse(errorResponse));