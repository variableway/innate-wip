# Source: https://betterstack.com/community/guides/scaling-nodejs/conditional-types/
# Original language: typescript
# Normalized: ts
# Block index: 15

[label src/utilities.ts]
// Extract the success data type from an API response
type ExtractData<T> = T extends { data: infer D } ? D : never;

// Extract the error type from an API response
type ExtractError<T> = T extends { error: infer E } ? E : never;

// Create a discriminated union for better type narrowing
type ApiResult<T> =
  | { success: true; data: T; error: null }
  | { success: false; data: null; error: string };

// Unwrap the data type from an ApiResult
type UnwrapResult<T> = T extends ApiResult<infer D> ? D : never;

// Example API functions
function getUser(id: number): ApiResult<{ id: number; name: string; email: string }> {
  if (id > 0) {
    return {
      success: true,
      data: { id, name: "John Doe", email: "john@example.com" },
      error: null
    };
  }
  return {
    success: false,
    data: null,
    error: "Invalid user ID"
  };
}

function getPosts(): ApiResult<Array<{ id: number; title: string; content: string }>> {
  return {
    success: true,
    data: [
      { id: 1, title: "First Post", content: "Hello World" },
      { id: 2, title: "Second Post", content: "TypeScript is great" }
    ],
    error: null
  };
}

// Generic handler that uses conditional types
function handleResult<T extends ApiResult<any>>(result: T): UnwrapResult<T> {
  if (!result.success) {
    throw new Error(result.error);
  }
  return result.data;
}

// TypeScript infers precise types for each call
const user = handleResult(getUser(1));
const posts = handleResult(getPosts());

console.log(`User: ${user.name} (${user.email})`);
console.log(`Posts: ${posts.map(p => p.title).join(", ")}`);

// Type-safe access to extracted types
type User = UnwrapResult<ReturnType<typeof getUser>>;
type Post = UnwrapResult<ReturnType<typeof getPosts>>[number];

const newUser: User = { id: 2, name: "Jane", email: "jane@example.com" };
const newPost: Post = { id: 3, title: "Third Post", content: "More content" };

console.log("New user:", newUser);
console.log("New post:", newPost);