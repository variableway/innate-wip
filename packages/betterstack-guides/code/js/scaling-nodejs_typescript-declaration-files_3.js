# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-declaration-files/
# Original language: javascript
# Normalized: js
# Block index: 3

[label src/math-utils.js]
export class Calculator {
  constructor() {
    this.history = [];
  }

  add(a, b) {
    const result = {
      value: a + b,
      operation: "addition",
      timestamp: new Date()
    };
    this.history.push(result);
    return result;
  }

  multiply(a, b) {
    const result = {
      value: a * b,
      operation: "multiplication",
      timestamp: new Date()
    };
    this.history.push(result);
    return result;
  }

  getHistory() {
    return [...this.history];
  }
}

export function formatResult(result) {
  return `${result.operation}: ${result.value} (${result.timestamp.toISOString()})`;
}

export const VERSION = "1.0.0";