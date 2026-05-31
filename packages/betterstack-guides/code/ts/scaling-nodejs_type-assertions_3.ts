# Source: https://betterstack.com/community/guides/scaling-nodejs/type-assertions/
# Original language: typescript
# Normalized: ts
# Block index: 3

[label src/problem.ts]
// DOM query returns generic type
const button = document.getElementById("submit-btn");

// TypeScript only knows it's HTMLElement | null
if (button) {
  button.disabled = true; // Error: Property 'disabled' doesn't exist on HTMLElement
  button.click();
}

// JSON parsing returns 'any'
const response = '{"name": "Alice", "age": 30}';
const data = JSON.parse(response);

// No autocomplete, no type safety
console.log(data.name.toUpperCase());
console.log(data.age * 2);