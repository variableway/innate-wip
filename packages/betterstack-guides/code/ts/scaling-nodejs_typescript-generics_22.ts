# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-generics/
# Original language: typescript
# Normalized: ts
# Block index: 22

type Partial<T> = {
  [P in keyof T]?: T[P]
};

interface User {
  id: number;
  name: string;
  email: string;
  address: string;
}

// Without Partial, all properties would be required
function updateUser(userId: number, updates: Partial<User>) {
  // Update only the provided fields
}

// We can pass just the fields we want to update
updateUser(1, {
  name: "New Name"
});