# Source: https://betterstack.com/community/guides/scaling-nodejs/conditional-types/
# Original language: typescript
# Normalized: ts
# Block index: 3

[label src/problem.ts]
// Basic type that doesn't adapt to input
type ApiResponse<T> = {
  data: T;
  error: null;
} | {
  data: null;
  error: string;
};

function fetchUser(): ApiResponse<{ name: string; email: string }> {
  return { data: { name: "John", email: "john@example.com" }, error: null };
}

function fetchPosts(): ApiResponse<Array<{ id: number; title: string }>> {
  return { data: [{ id: 1, title: "Hello" }], error: null };
}

// Try to create a generic unwrap function
function unwrapResponse<T>(response: ApiResponse<T>): T {
  if (response.error) {
    throw new Error(response.error);
  }
  return response.data;
}

const user = unwrapResponse(fetchUser());
const posts = unwrapResponse(fetchPosts());

console.log(user.name);
console.log(posts[0].title);