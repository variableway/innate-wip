# Source: https://betterstack.com/community/guides/scaling-nodejs/type-assertions-casting/
# Original language: typescript
# Normalized: ts
# Block index: 22

[label src/pitfalls.ts]
interface User {
  name: string;
  email: string;
}

// Pitfall 1: Asserting null/undefined values
function getUser(id: string): unknown {
  return id === "1" ? { name: "Alice", email: "alice@example.com" } : null;
}

const user = getUser("2") as User;  // Dangerous - might be null!
console.log("User name:", user.name);  // Crashes if null

// Pitfall 2: Asserting to wrong object shapes  
const apiResponse = { status: "success", code: 200 };
const user2 = apiResponse as User;  // Wrong shape entirely
console.log("User email:", user2.email);  // undefined, but TypeScript thinks it exists

// Pitfall 3: Asserting incompatible array types
const values: unknown[] = [1, 2, 3];
const strings = values as string[];  // Actually numbers!
console.log("Uppercase:", strings[0].toUpperCase());  // Crashes