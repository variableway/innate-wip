# Source: https://betterstack.com/community/guides/scaling-nodejs/template-literal-types-in-typescript/
# Original language: typescript
# Normalized: ts
# Block index: 8

[label src/unions.ts]
// HTTP methods and API versions as union types  
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type ApiVersion = 'v1' | 'v2' | 'v3';
type ResourceType = 'users' | 'posts' | 'comments';

// Template literal type that combines all possibilities
type ApiEndpoint = `/api/${ApiVersion}/${ResourceType}`;
type RouteSignature = `${HttpMethod} ${ApiEndpoint}`;

// TypeScript automatically generates all valid combinations
const endpoints: ApiEndpoint[] = [
  "/api/v1/users",    // Valid
  "/api/v2/posts",    // Valid  
  "/api/v3/comments", // Valid
  // "/api/v4/users", // Error: v4 not in ApiVersion union
];

const routes: RouteSignature[] = [
  "GET /api/v1/users",
  "POST /api/v2/posts", 
  "DELETE /api/v3/comments",
  // "PATCH /api/v1/users", // Error: PATCH not in HttpMethod union
];

console.log("Generated endpoints:", endpoints);
console.log("Generated routes:", routes);