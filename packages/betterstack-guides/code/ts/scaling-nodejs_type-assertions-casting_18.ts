# Source: https://betterstack.com/community/guides/scaling-nodejs/type-assertions-casting/
# Original language: typescript
# Normalized: ts
# Block index: 18

[label src/guards.ts]
function processValueWithAssertion(value: unknown) {
  // Type assertion - no runtime safety
  const str = value as string;
  console.log("Assertion approach:", str.toUpperCase());
}

function processValueWithGuard(value: unknown) {
  // Type guard - runtime verification
  if (typeof value === "string") {
    console.log("Guard approach:", value.toUpperCase());
  } else {
    console.log("Guard approach: not a string");
  }
}

console.log("--- Testing with string ---");
processValueWithAssertion("hello");
processValueWithGuard("hello");

console.log("\n--- Testing with number ---");
try {
  processValueWithAssertion(42);
} catch (error) {
  console.log("Assertion crashed:", (error as Error).message);
}
processValueWithGuard(42);