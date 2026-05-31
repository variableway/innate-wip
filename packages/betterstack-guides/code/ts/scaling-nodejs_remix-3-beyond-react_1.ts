# Source: https://betterstack.com/community/guides/scaling-nodejs/remix-3-beyond-react/
# Original language: typescript
# Normalized: ts
# Block index: 1

[label src/App.tsx]
import { pressDown } from '@remix-run/events/press';
import type { Remix } from '@remix-run/dom';

export function App(this: Remix.Handle) {
  let count = 0;

  const increment = () => {
    count++;
    this.update();
  };

  const decrement = () => {
    count--;
    this.update();
  };

  return () => (
    <div id="app">
      <h1>Counter</h1>
      <p>Clicks: {count}</p>
      <button on={pressDown(increment)} type="button">+</button>
      <button on={pressDown(decrement)} type="button">-</button>
    </div>
  );
}