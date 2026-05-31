# Source: https://betterstack.com/community/guides/scaling-nodejs/discriminated-unions/
# Original language: typescript
# Normalized: ts
# Block index: 8

[label src/problem.ts]
[highlight]
// Each variant is a separate type with the discriminator
interface SuccessResponse {
  status: "success";
  data: { userId: number; username: string };
}

interface ErrorResponse {
  status: "error";
  error: { message: string; code: number };
}

// Union of distinct variants
type ApiResponse = SuccessResponse | ErrorResponse;
[/highlight]

function handleResponse(response: ApiResponse) {
  if (response.status === "success") {
    // TypeScript knows response is SuccessResponse here
    console.log(`User: ${response.data.username}`);
  } else {
    // TypeScript knows response is ErrorResponse here
    console.log(`Error: ${response.error.message}`);
  }
}

const success: ApiResponse = {
  status: "success",
  data: { userId: 1, username: "alice" }
};

const failure: ApiResponse = {
  status: "error",
  error: { message: "Not found", code: 404 }
};

handleResponse(success);
handleResponse(failure);