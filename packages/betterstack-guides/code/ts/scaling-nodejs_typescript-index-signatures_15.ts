# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-index-signatures/
# Original language: typescript
# Normalized: ts
# Block index: 15

[label src/keys.ts]
// String index signature
interface StringDict {
  [key: string]: number;
}

const scores: StringDict = {
  alice: 95,
  bob: 87,
  "123": 100  // Numeric string keys are fine
};

// Number index signature for array-like objects
interface NumberArray {
  [index: number]: string;
}

const items: NumberArray = {
  0: "first",
  1: "second",
  2: "third"
};

console.log("Alice's score:", scores.alice);
console.log("Numeric key:", scores["123"]);
console.log("First item:", items[0]);
console.log("Second item:", items[1]);