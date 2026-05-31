# Source: https://betterstack.com/community/guides/scaling-nodejs/type-assertions-casting/
# Original language: typescript
# Normalized: ts
# Block index: 6

[label src/problem.ts]
function processInput() {
[highlight]
  const input = document.getElementById("username") as HTMLInputElement;
[/highlight]
  
  // Now TypeScript knows these properties exist
  console.log("Input value:", input.value);
  console.log("Input type:", input.type);
}

// Simulate DOM for Node environment
global.document = {
  getElementById: () => ({
    tagName: "INPUT",
    value: "alice@example.com",
    type: "email"
  })
} as any;

processInput();