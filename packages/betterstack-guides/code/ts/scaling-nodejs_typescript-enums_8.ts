# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-enums/
# Original language: typescript
# Normalized: ts
# Block index: 8

[label src/numeric-enums.ts]
// Numeric enum with auto-incrementing values
enum Priority {
  Low,      // 0
  Medium,   // 1
  High,     // 2
  Critical  // 3
}

// Type-safe priority comparisons
function escalateIfNeeded(currentPriority: Priority): Priority {
  if (currentPriority >= Priority.High) {
    return Priority.Critical;
  }
  return currentPriority + 1;
}

const taskPriority = Priority.Medium;
const escalated = escalateIfNeeded(taskPriority);

console.log('Original:', Priority[taskPriority]); // Reverse mapping
console.log('Escalated:', Priority[escalated]);