# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-declaration-files/
# Original language: typescript
# Normalized: ts
# Block index: 4

[label src/app.ts]
import { Calculator, formatResult, VERSION } from "./math-utils.js";

const calc = new Calculator();
const result = calc.add(5, 10);

console.log(formatResult(result));
console.log("Version:", VERSION);
console.log("History:", calc.getHistory());