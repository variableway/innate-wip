# Source: https://betterstack.com/community/guides/scaling-nodejs/template-literal-types-in-typescript/
# Original language: typescript
# Normalized: ts
# Block index: 3

[label src/problem.ts]
type ApiPath = string;
type CssClass = string;

const userPath: ApiPath = "/api/users";     // Valid
const btnClass: CssClass = "btn-primary";  // Valid

// But these problematic values are also "valid":
const badPath: ApiPath = "api/users";      // Missing leading slash - no error!
const badClass: CssClass = "primary-btn"; // Wrong prefix - no error!

console.log("API path:", userPath);
console.log("Bad path:", badPath);         // Runtime issue waiting to happen
console.log("CSS class:", btnClass);
console.log("Bad class:", badClass);       // Wrong CSS class structure