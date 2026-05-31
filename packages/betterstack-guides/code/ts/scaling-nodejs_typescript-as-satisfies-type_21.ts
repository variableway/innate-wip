# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-as-satisfies-type/
# Original language: typescript
# Normalized: ts
# Block index: 21

[label union-pattern.ts]
type Action =
  | { type: "INCREMENT"; amount: number }
  | { type: "DECREMENT"; amount: number }
  | { type: "RESET" };

// Preserves exact "INCREMENT" type
const incrementAction = {
  type: "INCREMENT",
  amount: 5
} satisfies Action;

// Can narrow effectively
function reducer(state: number, action: Action) {
  if (action.type === incrementAction.type) {
    // TypeScript knows this is INCREMENT
    return state + action.amount;
  }
  return state;
}