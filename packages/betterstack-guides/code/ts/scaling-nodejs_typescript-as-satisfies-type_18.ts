# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-as-satisfies-type/
# Original language: typescript
# Normalized: ts
# Block index: 18

[label combined-pattern.ts]
type Status = "pending" | "active" | "inactive";

// Annotation for reassignable variable
let userStatus: Status = "pending" satisfies Status;

userStatus = "active"; // Can reassign to any Status
userStatus = "invalid"; // Error: not a valid Status

// For constants, satisfies alone is often enough
const defaultStatus = "pending" satisfies Status;