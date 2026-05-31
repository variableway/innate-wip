# Source: https://betterstack.com/community/guides/scaling-nodejs/tsx-explained/
# Original language: typescript
# Normalized: ts
# Block index: 15

[label native-types-example.ts]
interface User {
  id: number;
  name: string;
  isActive: boolean;
}

const createUser = (name: string): User => {
  return {
    id: Math.floor(Math.random() * 1000),
    name,
    isActive: true
  };
};

const user = createUser('Native TypeScript User');
console.log('Created user:', user);