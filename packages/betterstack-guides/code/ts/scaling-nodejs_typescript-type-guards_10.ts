# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-type-guards/
# Original language: typescript
# Normalized: ts
# Block index: 10

[label src/typeof-guards.ts]
// Function accepting multiple types
function formatValue(value: string | number | boolean | null): string {
  if (typeof value === 'string') {
    return value.toUpperCase();
  }
  
  if (typeof value === 'number') {
    return value.toFixed(2);
  }
  
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  
  return 'N/A';
}

// Test with different types
console.log(formatValue('hello'));
console.log(formatValue(42.5));
console.log(formatValue(true));
console.log(formatValue(null));