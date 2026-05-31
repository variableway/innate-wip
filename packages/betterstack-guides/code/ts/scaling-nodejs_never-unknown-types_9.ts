# Source: https://betterstack.com/community/guides/scaling-nodejs/never-unknown-types/
# Original language: typescript
# Normalized: ts
# Block index: 9

[label src/safe-parsing.ts]
type User = { id: number; name: string; };

function parseUser(data: unknown): User {
  if (typeof data !== 'object' || data === null) {
    throw new Error('Invalid user data: not an object');
  }

  const obj = data as Record<string, unknown>;

  if (typeof obj.id !== 'number') {
    throw new Error('Invalid user data: id must be a number');
  }
  if (typeof obj.name !== 'string') {
    throw new Error('Invalid user data: name must be a string');
  }

  return { id: obj.id, name: obj.name };
}

// Test with different data
const validData: unknown = { id: 123, name: 'Alice' };
const invalidData: unknown = { id: '123', name: 'Bob' };

console.log(parseUser(validData));   // Works
console.log(parseUser(invalidData)); // Throws error