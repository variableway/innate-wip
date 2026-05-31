# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-sourcemap-option/
# Original language: typescript
# Normalized: ts
# Block index: 3

[label src/calculator.ts]
interface CalculationResult {
  operation: string;
  input: number[];
  result: number;
}

class Calculator {
  private history: CalculationResult[] = [];

  add(...numbers: number[]): number {
    const result = numbers.reduce((sum, num) => sum + num, 0);
    this.recordOperation("addition", numbers, result);
    return result;
  }

  multiply(...numbers: number[]): number {
    const result = numbers.reduce((product, num) => product * num, 1);
    this.recordOperation("multiplication", numbers, result);
    return result;
  }

  private recordOperation(operation: string, input: number[], result: number): void {
    this.history.push({ operation, input, result });
  }

  getHistory(): CalculationResult[] {
    return [...this.history];
  }
}

const calc = new Calculator();
console.log("Sum:", calc.add(5, 10, 15));
console.log("Product:", calc.multiply(2, 3, 4));
console.log("History:", calc.getHistory());