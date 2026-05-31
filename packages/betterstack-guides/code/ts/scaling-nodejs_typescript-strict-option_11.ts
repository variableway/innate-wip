# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-strict-option/
# Original language: typescript
# Normalized: ts
# Block index: 11

[label src/without-strict.ts]
...

const user = { name: "Alice" };
console.log(getUserName(user));

[highlight]
const result = processValue(42);
[/highlight]
console.log(result);

const items = [{ id: 1 }, { id: 2 }];
const item = findItem(items, 5);
if (item) {
  console.log(item.id);
} else {
  console.log("Item not found");
}