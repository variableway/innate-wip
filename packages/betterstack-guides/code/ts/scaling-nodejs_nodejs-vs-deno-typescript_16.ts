# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-vs-deno-typescript/
# Original language: typescript
# Normalized: ts
# Block index: 16

// Deno JSX support is built-in
/** @jsx h */
import { h } from "https://esm.sh/preact";
export default function App() {
  return <div>Hello from JSX!</div>;
}