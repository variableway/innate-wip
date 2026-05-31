# Source: https://betterstack.com/community/guides/scaling-nodejs/oxlint-vs-eslint/
# Original language: typescript
# Normalized: ts
# Block index: 15

async function saveUser(user: User) {
  await db.users.insert(user);
}

function handleSubmit(user: User) {
  // ESLint error: floating promise
  saveUser(user);
  showSuccess();
}