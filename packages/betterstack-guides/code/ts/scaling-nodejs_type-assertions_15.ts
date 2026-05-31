# Source: https://betterstack.com/community/guides/scaling-nodejs/type-assertions/
# Original language: typescript
# Normalized: ts
# Block index: 15

[label src/double.ts]
interface Cat {
  meow(): void;
}

interface Dog {
  bark(): void;
}

const cat: Cat = { meow: () => console.log("Meow") };

// This fails - types don't overlap
const dog = cat as Dog;