# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-interfaces/
# Original language: typescript
# Normalized: ts
# Block index: 3

[label src/problem.ts]
function createUser(user) {
  console.log(`Creating user: ${user.name}`);
  console.log(`Email: ${user.email}`);
  console.log(`Age: ${user.age}`);
  return { id: Math.random(), ...user };
}

// Correct shape
const validUser = createUser({
  name: "Alice",
  email: "alice@example.com",
  age: 30
});

// Missing property - no error!
const invalidUser = createUser({
  name: "Bob",
  email: "bob@example.com"
});

// Wrong property name - no error!
const typoUser = createUser({
  name: "Charlie",
  emial: "charlie@example.com",  // Typo in 'email'
  age: 25
});

console.log(validUser);