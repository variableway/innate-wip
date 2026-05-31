# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-declaration-files/
# Original language: typescript
# Normalized: ts
# Block index: 6

[label src/app.ts]
import { Calculator, formatResult, VERSION } from "./math-utils.js";

const calc = new Calculator();
const result = calc.add("5", "10"); // Wrong types
const badResult = calc.multiply(5); // Missing argument

console.log(formatResult(result));
console.log("Version:", VERSION);
console.log("History:", calc.getHistory());