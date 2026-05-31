# Source: https://betterstack.com/community/guides/scaling-nodejs/type-assertions/
# Original language: typescript
# Normalized: ts
# Block index: 24

[label src/const.ts]
const config = {
  host: "localhost",
  port: 3000,
  enabled: true
} as const;

[highlight]
// Const assertions work great with tuples
const tuple = [1, "hello", true] as const;
// Type: readonly [1, "hello", true]

// Const assertions create enum-like values
const STATUS = {
  PENDING: "pending",
  SUCCESS: "success",
  ERROR: "error"
} as const;

type StatusValue = typeof STATUS[keyof typeof STATUS];
// Type: "pending" | "success" | "error"

function updateStatus(status: StatusValue) {
  console.log(`Status: ${status}`);
}

updateStatus(STATUS.SUCCESS);
[/highlight]