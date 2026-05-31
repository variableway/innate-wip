# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-sourcemap-option/
# Original language: typescript
# Normalized: ts
# Block index: 12

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

  divide(a: number, b: number): number {
    if (b === 0) {
      throw new Error("Cannot divide by zero");
    }
    const result = a / b;
    this.recordOperation("division", [a, b], result);
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

// This will throw an error
try {
  console.log("Division:", calc.divide(10, 0));
} catch (error) {
  console.error("Error caught:", error);
  console.error("Stack trace:", (error as Error).stack);
}