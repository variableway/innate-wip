# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-optional-properties/
# Original language: typescript
# Normalized: ts
# Block index: 3

[label src/problem.ts]
interface User {
  name: string;
  email: string;
  phone: string;
}

function sendNotification(user: User) {
  const phoneNumber = user.phone.replace(/-/g, '');
  console.log(`Sending SMS to ${phoneNumber}`);
}

const user: User = {
  name: "Alice",
  email: "alice@example.com",
  phone: undefined as any  // Simulating missing optional data
};

sendNotification(user);