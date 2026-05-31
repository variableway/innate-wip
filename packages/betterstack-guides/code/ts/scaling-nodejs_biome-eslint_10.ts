# Source: https://betterstack.com/community/guides/scaling-nodejs/biome-eslint/
# Original language: typescript
# Normalized: ts
# Block index: 10

async function fetchUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}

function displayUser(id: string) {
  // ESLint catches this - missing await
  const user = fetchUser(id);
  console.log(user.name); // Error: user is a Promise, not a User
}