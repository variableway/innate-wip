# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-declaration-files/
# Original language: typescript
# Normalized: ts
# Block index: 9

[label src/test.ts]
import { Calculator, formatResult } from "./math-utils.js";

// TypeScript uses the declaration file automatically
const calculator: Calculator = new Calculator();
const result = calculator.add(1, 2);

// The CalculationResult interface from the .d.ts is available
console.log(result.value);
console.log(result.operation);
console.log(result.timestamp);

// Type checking works on function parameters
formatResult(result); // ✓ Correct
formatResult("wrong"); // ✗ Type error