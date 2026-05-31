# Source: https://betterstack.com/community/guides/scaling-nodejs/bun-vs-ts-node-typescript/
# Original language: bash
# Normalized: sh
# Block index: 5

# ts-node ESM requires specific Node.js flags
node --loader ts-node/esm app.ts
# Or with newer Node.js versions
node --import ts-node/esm app.ts

# Plus additional tsconfig.json setup
{
  "ts-node": {
    "esm": true
  },
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "node"
  }
}