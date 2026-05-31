# Source: https://betterstack.com/community/guides/scaling-nodejs/conditional-types/
# Original language: typescript
# Normalized: ts
# Block index: 7

[label src/problem.ts]
type ApiResponse<T> = {
  data: T;
  error: null;
} | {
  data: null;
  error: string;
};

[highlight]
// Conditional type that checks for error state
type UnwrapResponse<T> = T extends { error: string } ? never : T extends { data: infer D } ? D : never;
[/highlight]

function fetchUser(): ApiResponse<{ name: string; email: string }> {
  return { data: { name: "John", email: "john@example.com" }, error: null };
}

function fetchPosts(): ApiResponse<Array<{ id: number; title: string }>> {
  return { data: [{ id: 1, title: "Hello" }], error: null };
}

[highlight]
// Generic unwrap function using conditional type
function unwrapResponse<T extends ApiResponse<any>>(response: T): UnwrapResponse<T> {
  if (response.error) {
    throw new Error(response.error);
  }
  return response.data as UnwrapResponse<T>;
}
[/highlight]

const user = unwrapResponse(fetchUser());
const posts = unwrapResponse(fetchPosts());

console.log(user.name);
console.log(posts[0].title);