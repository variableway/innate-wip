# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-as-satisfies-type/
# Original language: typescript
# Normalized: ts
# Block index: 12

[label when-widening-wanted.ts]
type Status = "idle" | "loading" | "success" | "error";

// With satisfies, can't reassign to other valid values
let status1 = "idle" satisfies Status;
status1 = "loading"; // Error: Type '"loading"' not assignable to '"idle"'

// With annotation, can reassign to any valid status
let status2: Status = "idle";
status2 = "loading"; // Works fine