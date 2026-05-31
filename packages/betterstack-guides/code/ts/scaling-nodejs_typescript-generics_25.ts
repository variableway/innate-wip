# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-generics/
# Original language: typescript
# Normalized: ts
# Block index: 25

async function fetchApi<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

interface User {
  id: number;
  name: string;
  email: string;
}

// Now we can fetch with type safety
async function getUser(id: number) {
  const user = await fetchApi<User>(`/api/users/${id}`);

  // TypeScript knows 'user' is of type 'User'
  console.log(user.name);

  return user;
}