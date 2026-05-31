# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-as-satisfies-type/
# Original language: typescript
# Normalized: ts
# Block index: 17

[label generic-inference.ts]
function createStore<T>(initial: T) {
  return {
    value: initial,
    update: (newValue: T) => {}
  };
}

// TypeScript infers T as the literal type
const store1 = createStore({ count: 0 });
store1.update({ count: 5 }); // Works

// Sometimes need to widen with as
const store2 = createStore({ count: 0 } as { count: number });
store2.update({ count: 5 }); // More flexible