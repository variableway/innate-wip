# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-strict-option/
# Original language: typescript
# Normalized: ts
# Block index: 3

[label src/without-strict.ts]
function getUserName(user) {
  return user.name.toUpperCase();
}

function processValue(value) {
  return value * 2;
}

function findItem(items, index) {
  return items[index].id;
}

const user = { name: "Alice" };
console.log(getUserName(user));

const result = processValue("42");
console.log(result);

const items = [{ id: 1 }, { id: 2 }];
console.log(findItem(items, 5));