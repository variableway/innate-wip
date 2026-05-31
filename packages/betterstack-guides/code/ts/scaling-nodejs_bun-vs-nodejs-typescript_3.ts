# Source: https://betterstack.com/community/guides/scaling-nodejs/bun-vs-nodejs-typescript/
# Original language: typescript
# Normalized: ts
# Block index: 3

// Native Node.js handles basic TypeScript beautifully
interface User {
  name: string;
  email: string;
}

function createUser(userData: User): User {
  return {
    name: userData.name.trim(),
    email: userData.email.toLowerCase()
  };
}

// Advanced features require experimental flags
enum Status {  // Needs --experimental-transform-types
  Active = 'active',
  Inactive = 'inactive'
}

// Some features aren't supported yet
@decorator  // Parser error - not supported
class MyClass {}