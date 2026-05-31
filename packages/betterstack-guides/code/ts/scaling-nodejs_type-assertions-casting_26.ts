# Source: https://betterstack.com/community/guides/scaling-nodejs/type-assertions-casting/
# Original language: typescript
# Normalized: ts
# Block index: 26

// Check before asserting
const element = document.getElementById("input");
if (element) {
  const input = element as HTMLInputElement;
  console.log(input.value);
}

// Use type guards instead
function isUser(value: unknown): value is User {
  return typeof value === "object" && 
         value !== null && 
         "name" in value && 
         "email" in value;
}

const data = getUser("1");
if (isUser(data)) {
  console.log(data.name);  // Safe
}