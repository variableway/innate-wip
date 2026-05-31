# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-generics/
# Original language: typescript
# Normalized: ts
# Block index: 5

function createStore<ItemType, KeyType>(
  items: ItemType[],
  getKey: (item: ItemType) => KeyType
) {
  // Implementation...
}