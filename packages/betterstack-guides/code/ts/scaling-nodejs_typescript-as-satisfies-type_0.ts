# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-as-satisfies-type/
# Original language: typescript
# Normalized: ts
# Block index: 0

[label basic-annotations.ts]
const username: string = "John";
const age: number = 30;

function getUser(id: string): User {
  return { id, name: "John", email: "john@example.com" };
}

const config: Config = {
  apiUrl: "https://api.example.com",
  timeout: 5000
};