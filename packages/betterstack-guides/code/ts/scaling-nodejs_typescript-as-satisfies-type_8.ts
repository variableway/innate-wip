# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-as-satisfies-type/
# Original language: typescript
# Normalized: ts
# Block index: 8

[label const-assertions.ts]
const routes = [
  { path: "/users", method: "GET" },
  { path: "/posts", method: "POST" }
] as const;

// Type: readonly [
//   { readonly path: "/users"; readonly method: "GET" },
//   { readonly path: "/posts"; readonly method: "POST" }
// ]

routes[0].path = "/accounts"; // Error: Cannot assign to readonly