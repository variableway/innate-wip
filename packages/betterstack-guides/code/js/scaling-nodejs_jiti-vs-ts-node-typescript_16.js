# Source: https://betterstack.com/community/guides/scaling-nodejs/jiti-vs-ts-node-typescript/
# Original language: javascript
# Normalized: js
# Block index: 16

// ts-node enables full type checking by default
require('ts-node').register({
  transpileOnly: false // Full type checking enabled
});

// TypeScript errors caught at runtime
const result: string = 42; // TS2322: Type 'number' not assignable to 'string'