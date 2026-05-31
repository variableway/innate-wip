# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-generics/
# Original language: typescript
# Normalized: ts
# Block index: 27

function processData<T>(data: T): { processed: boolean; data: T } {
  return {
    processed: true,
    data
  };
}

const result = processData("some data");
console.log(result.data.toUpperCase());  // Safe!