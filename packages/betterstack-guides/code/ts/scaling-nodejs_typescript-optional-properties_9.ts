# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-optional-properties/
# Original language: typescript
# Normalized: ts
# Block index: 9

[label src/problem.ts]
...
function sendNotification(user: User) {
  [highlight]
  if (user.phone) {
[/highlight]
    const phoneNumber = user.phone.replace(/-/g, '');
    console.log(`Sending SMS to ${phoneNumber}`);
  [highlight]
  } else {
    console.log('Phone number not available');
  }
  [/highlight]
}
...