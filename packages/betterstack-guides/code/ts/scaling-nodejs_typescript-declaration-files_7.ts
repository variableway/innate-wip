# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-declaration-files/
# Original language: typescript
# Normalized: ts
# Block index: 7

[label src/math-utils.d.ts]
export interface CalculationResult {
  value: number;
  operation: string;
  timestamp: Date;
}

export class Calculator {
  add(a: number, b: number): CalculationResult;
  multiply(a: number, b: number): CalculationResult;
  getHistory(): CalculationResult[];
}

export function formatResult(result: CalculationResult): string;

export const VERSION: string;