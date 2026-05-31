# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-strict-option/
# Original language: typescript
# Normalized: ts
# Block index: 9

[label src/without-strict.ts]
[highlight]
interface User {
  name: string;
}

function getUserName(user: User): string {
[/highlight]
  return user.name.toUpperCase();
}

[highlight]
function processValue(value: number): number {
[/highlight]
  return value * 2;
}

[highlight]
interface Item {
  id: number;
}

function findItem(items: Item[], index: number): Item | undefined {
  return items[index];
}
[/highlight]


const user = { name: "Alice" };
console.log(getUserName(user));

const result = processValue("42");
console.log(result);

const items = [{ id: 1 }, { id: 2 }];
console.log(findItem(items, 5));