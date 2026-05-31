# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-declaration-files/
# Original language: javascript
# Normalized: js
# Block index: 11

[label src/data-store.js]
export class DataStore {
  constructor() {
    this.data = new Map();
  }

  set(key, value) {
    this.data.set(key, value);
  }

  get(key) {
    return this.data.get(key);
  }

  has(key) {
    return this.data.has(key);
  }

  delete(key) {
    return this.data.delete(key);
  }

  clear() {
    this.data.clear();
  }

  get size() {
    return this.data.size;
  }
}

export function createStore(initialData) {
  const store = new DataStore();
  if (initialData) {
    for (const [key, value] of Object.entries(initialData)) {
      store.set(key, value);
    }
  }
  return store;
}