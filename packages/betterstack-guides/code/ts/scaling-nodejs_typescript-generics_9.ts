# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-generics/
# Original language: typescript
# Normalized: ts
# Block index: 9

interface Container<T> {
  value: T;
  getValue(): T;
}

// Implementation
class NumberContainer implements Container<number> {
  constructor(public value: number) {}

  getValue(): number {
    return this.value;
  }
}

const container = new NumberContainer(42);
const value = container.getValue();  // Type: number