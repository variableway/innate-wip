# Source: https://betterstack.com/community/guides/scaling-nodejs/type-assertions/
# Original language: typescript
# Normalized: ts
# Block index: 6

[label src/problem.ts]
[highlight]
// Assert specific element type
const button = document.getElementById("submit-btn") as HTMLButtonElement;
[/highlight]

if (button) {
  button.disabled = true;
  button.click();
}

const response = '{"name": "Alice", "age": 30}';
[highlight]
// Assert the parsed structure
const data = JSON.parse(response) as { name: string; age: number };
[/highlight]

console.log(data.name.toUpperCase());
console.log(data.age * 2);