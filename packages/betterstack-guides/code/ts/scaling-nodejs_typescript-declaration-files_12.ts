# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-declaration-files/
# Original language: typescript
# Normalized: ts
# Block index: 12

[label src/data-store.d.ts]
export class DataStore<K, V> {
  set(key: K, value: V): void;
  get(key: K): V | undefined;
  has(key: K): boolean;
  delete(key: K): boolean;
  clear(): void;
  get size(): number;
}

export function createStore<T extends Record<string, any>>(
  initialData?: T
): DataStore<keyof T, T[keyof T]>;