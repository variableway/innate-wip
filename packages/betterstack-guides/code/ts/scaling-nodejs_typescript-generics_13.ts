# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-generics/
# Original language: typescript
# Normalized: ts
# Block index: 13

class KeyValueStore<K, V> {
  private store = new Map<K, V>();

  set(key: K, value: V): void {
    this.store.set(key, value);
  }

  get(key: K): V | undefined {
    return this.store.get(key);
  }

  has(key: K): boolean {
    return this.store.has(key);
  }

  delete(key: K): boolean {
    return this.store.delete(key);
  }
}

// Create a store with string keys and number values
const userAges = new KeyValueStore<string, number>();
userAges.set("Alice", 30);
userAges.set("Bob", 25);

const aliceAge = userAges.get("Alice");  // Type: number | undefined