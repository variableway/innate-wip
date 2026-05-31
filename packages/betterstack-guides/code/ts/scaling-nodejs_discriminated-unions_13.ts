# Source: https://betterstack.com/community/guides/scaling-nodejs/discriminated-unions/
# Original language: typescript
# Normalized: ts
# Block index: 13

[label src/invalid.ts]
interface SuccessResponse {
  status: "success";
  data: { userId: number; username: string };
}

interface ErrorResponse {
  status: "error";
  error: { message: string; code: number };
}

type ApiResponse = SuccessResponse | ErrorResponse;

// TypeScript rejects these invalid states:
const invalid1: ApiResponse = {
  status: "success",
  error: { message: "This makes no sense", code: 500 }  // Error!
};

const invalid2: ApiResponse = {
  status: "error",
  data: { userId: 1, username: "alice" }  // Error!
};