# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-generics/
# Original language: typescript
# Normalized: ts
# Block index: 16

function logProperty<T extends { name: string }>(obj: T): void {
  console.log(obj.name);  // Safe! We know 'obj' has a 'name' property
}

// These work
logProperty({ name: "Alice", age: 30 });
logProperty({ name: "Book", pages: 250 });

// This would cause a compile-time error
logProperty({ age: 30 });  // Error: Property 'name' is missing