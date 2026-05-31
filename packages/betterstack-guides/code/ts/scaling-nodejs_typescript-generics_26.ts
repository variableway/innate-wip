# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-generics/
# Original language: typescript
# Normalized: ts
# Block index: 26

function processData(data: any): any {
  return {
    processed: true,
    data
  };
}

const result = processData("some data");
// No type safety - TypeScript doesn't know what's in 'result'