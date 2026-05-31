# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-as-satisfies-type/
# Original language: typescript
# Normalized: ts
# Block index: 15

[label narrowing-with-as.ts]
interface Dog {
  type: "dog";
  bark(): void;
}

interface Cat {
  type: "cat";
  meow(): void;
}

type Animal = Dog | Cat;

function handleAnimal(animal: Animal) {
  if (animal.type === "dog") {
    // TypeScript already knows it's a Dog
    animal.bark();
    
    // Explicit assertion is redundant but sometimes clearer
    const dog = animal as Dog;
    dog.bark();
  }
}