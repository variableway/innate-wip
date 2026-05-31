# Source: https://betterstack.com/community/guides/scaling-nodejs/type-assertions/
# Original language: typescript
# Normalized: ts
# Block index: 18

[label src/double.ts]
interface Cat {
  meow(): void;
}

interface Dog {
  bark(): void;
}

const cat: Cat = { meow: () => console.log("Meow") };

[highlight]
// Double assertion forces TypeScript to accept it
const dog = cat as unknown as Dog;

dog.bark(); // Will crash!
[/highlight]