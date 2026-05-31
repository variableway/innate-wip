# Source: https://betterstack.com/community/guides/scaling-nodejs/template-literal-types-in-typescript/
# Original language: typescript
# Normalized: ts
# Block index: 5

[label src/problem.ts]
[highlight]
// Template literal types that enforce specific patterns
type ApiPath = `/api/${string}`;
type CssClass = `btn-${string}`;
[/highlight]

const userPath: ApiPath = "/api/users";     // Valid - matches /api/ pattern
const btnClass: CssClass = "btn-primary";  // Valid - matches btn- pattern

// But these problematic values are also "valid":
const badPath: ApiPath = "api/users"; // Missing leading slash - no error!
const badClass: CssClass = "primary-btn"; // Wrong prefix - no error!
...