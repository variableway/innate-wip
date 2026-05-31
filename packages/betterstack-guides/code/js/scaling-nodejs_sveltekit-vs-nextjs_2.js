# Source: https://betterstack.com/community/guides/scaling-nodejs/sveltekit-vs-nextjs/
# Original language: javascript
# Normalized: js
# Block index: 2

// Load function runs on server
export async function load() {
  const users = await fetchUsers();
  return { users };
}