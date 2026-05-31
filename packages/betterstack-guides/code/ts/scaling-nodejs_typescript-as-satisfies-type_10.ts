# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-as-satisfies-type/
# Original language: typescript
# Normalized: ts
# Block index: 10

[label discriminated-unions.ts]
type Request = {
  method: "GET" | "POST" | "PUT" | "DELETE";
  url: string;
  body?: unknown;
};

// Annotation widens method to the union
const getRequest: Request = {
  method: "GET",
  url: "/api/users"
};

// TypeScript can't eliminate impossible cases
if (getRequest.method === "GET") {
  // Still thinks body might exist
}

// Satisfies preserves the literal "GET"
const getRequest2 = {
  method: "GET",
  url: "/api/users"
} satisfies Request;

// TypeScript knows method is exactly "GET"
if (getRequest2.method === "GET") {
  // Better type narrowing
}