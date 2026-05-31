# Source: https://betterstack.com/community/guides/scaling-nodejs/type-assertions/
# Original language: typescript
# Normalized: ts
# Block index: 12

[label src/danger.ts]
interface User {
  name: string;
  email: string;
}

[highlight]
const parsed = JSON.parse('{"name": "Bob"}');

// Validate before using
function isUser(value: unknown): value is User {
  return (
    typeof value === "object" &&
    value !== null &&
    "name" in value &&
    "email" in value &&
    typeof (value as any).name === "string" &&
    typeof (value as any).email === "string"
  );
}

if (isUser(parsed)) {
  console.log(`User: ${parsed.name}`);
  console.log(`Email: ${parsed.email.toLowerCase()}`);
} else {
  console.log("Invalid user data");
}
[/highlight]