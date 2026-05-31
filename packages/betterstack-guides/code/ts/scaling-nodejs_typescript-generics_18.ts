# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-generics/
# Original language: typescript
# Normalized: ts
# Block index: 18

function merge
  T extends object,
  U extends object
>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 };
}

const result = merge(
  { name: "Alice" },
  { age: 30 }
);

// Result type is { name: string, age: number }
console.log(result.name);  // "Alice"
console.log(result.age);   // 30

// This would fail
// merge("not an object", { age: 30 });  // Error: Argument of type 'string' is not assignable to parameter of type 'object'