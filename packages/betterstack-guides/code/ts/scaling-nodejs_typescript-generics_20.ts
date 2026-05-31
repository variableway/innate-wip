# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-generics/
# Original language: typescript
# Normalized: ts
# Block index: 20

function combine<T, U, R>(
  a: T,
  b: U,
  combiner: (a: T, b: U) => R
): R {
  return combiner(a, b);
}

const result = combine(
  "Hello",
  5,
  (a, b) => `${a} repeated ${b} times: ${a.repeat(b)}`
);

// TypeScript infers result as string
console.log(result);  // "Hello repeated 5 times: HelloHelloHelloHelloHello"