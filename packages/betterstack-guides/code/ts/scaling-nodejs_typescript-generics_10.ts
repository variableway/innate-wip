# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-generics/
# Original language: typescript
# Normalized: ts
# Block index: 10

interface Pair<K, V> {
  key: K;
  value: V;
}

const pair: Pair<string, number> = {
  key: "age",
  value: 30
};

// You can use different types
const anotherPair: Pair<number, boolean> = {
  key: 1,
  value: true
};