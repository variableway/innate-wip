# Source: https://betterstack.com/community/guides/scaling-nodejs/discriminated-unions/
# Original language: typescript
# Normalized: ts
# Block index: 3

[label src/problem.ts]
interface ApiResponse {
  status: "success" | "error";
  data?: { userId: number; username: string };
  error?: { message: string; code: number };
}

function handleResponse(response: ApiResponse) {
  if (response.status === "success") {
    // TypeScript doesn't narrow here - data might be undefined
    console.log(`User: ${response.data?.username}`);
  } else {
    // Same issue - error might be undefined
    console.log(`Error: ${response.error?.message}`);
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