# Source: https://betterstack.com/community/guides/scaling-nodejs/remix-3-beyond-react/
# Original language: typescript
# Normalized: ts
# Block index: 0

[label src/App.tsx]
export function App() {
  let count = 0;

  return () => (
    <div id="app">
      <h1>Counter</h1>
      <p>Clicks: {count}</p>
      <button>+</button>
      <button>-</button>
    </div>
  );
}