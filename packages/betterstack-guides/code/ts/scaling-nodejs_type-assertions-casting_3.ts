# Source: https://betterstack.com/community/guides/scaling-nodejs/type-assertions-casting/
# Original language: typescript
# Normalized: ts
# Block index: 3

[label src/problem.ts]
function processInput() {
  const input = document.getElementById("username");
  
  // Try to access input-specific properties
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