# Source: https://betterstack.com/community/guides/scaling-nodejs/never-unknown-types/
# Original language: typescript
# Normalized: ts
# Block index: 12

[label src/complete-example.ts]
type ApiStatus = 'success' | 'error';

// Start simple - just handle the two main cases
function handleApiResponse(response: unknown): string {
  // First, validate it's an object (unknown safety)
  if (typeof response !== 'object' || response === null) {
    throw new Error('Invalid response format');
  }
  
  const obj = response as Record<string, unknown>;
  
  // Then handle all possible statuses (never safety)
  switch (obj.status) {
    case 'success':
      return 'Operation succeeded';
    case 'error':
      return 'Operation failed';
    default:
      const exhaustiveCheck: never = obj.status;
      throw new Error(`Unknown status: ${exhaustiveCheck}`);
  }
}

// Test it works
const successResponse: unknown = { status: 'success' };
const errorResponse: unknown = { status: 'error' };

console.log(handleApiResponse(successResponse)); // "Operation succeeded"
console.log(handleApiResponse(errorResponse));   // "Operation failed"