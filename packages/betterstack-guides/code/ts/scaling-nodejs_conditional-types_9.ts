# Source: https://betterstack.com/community/guides/scaling-nodejs/conditional-types/
# Original language: typescript
# Normalized: ts
# Block index: 9

[label src/infer.ts]
// Extract return type from any function
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

// Extract parameter types from any function
type Parameters<T> = T extends (...args: infer P) => any ? P : never;

// Extract first parameter type
type FirstParameter<T> = T extends (first: infer F, ...args: any[]) => any ? F : never;

// Test with actual functions
function createUser(name: string, email: string): { id: number; name: string; email: string } {
  return { id: 1, name, email };
}

function fetchData(url: string): Promise<any> {
  return fetch(url).then(r => r.json());
}

// Extract types using our utilities
type CreateUserReturn = ReturnType<typeof createUser>;
type CreateUserParams = Parameters<typeof createUser>;
type CreateUserFirstParam = FirstParameter<typeof createUser>;

type FetchDataReturn = ReturnType<typeof fetchData>;
type FetchDataParams = Parameters<typeof fetchData>;

// Use the extracted types
const user: CreateUserReturn = {
  id: 1,
  name: "John",
  email: "john@example.com"
};

const params: CreateUserParams = ["John", "john@example.com"];
const firstName: CreateUserFirstParam = "John";

console.log("User:", user);
console.log("Params:", params);
console.log("First param:", firstName);