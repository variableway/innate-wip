# Source: https://betterstack.com/community/guides/scaling-nodejs/rest-parameters-spread/
# Original language: typescript
# Normalized: ts
# Block index: 6

[label src/solution.ts]
function sum(...numbers: number[]
): number {
  return numbers.reduce((total, n) => total + n, 0);
}

function logMessages(prefix: string,
[highlight]
...messages: string[]
[/highlight]
): void {
  messages.forEach(msg => console.log(`${prefix}: ${msg}`));
}

console.log("Sum of 1, 2, 3:", sum(1, 2, 3));
console.log("Sum of 1, 2, 3, 4, 5:", sum(1, 2, 3, 4, 5));

logMessages("INFO", "Server started", "Port 3000", "Ready");