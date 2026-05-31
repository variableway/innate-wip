# Source: https://betterstack.com/community/guides/scaling-nodejs/jiti-runtime/
# Original language: javascript
# Normalized: js
# Block index: 22

[label cache-demo.js]
import { createJiti } from 'jiti';

// Jiti with caching enabled
const jitiCached = createJiti(import.meta.url, {
  cache: true,
  debug: true
});

// Jiti without caching
const jitiUncached = createJiti(import.meta.url, {
  cache: false,
  debug: true
});

console.time('First load (cached)');
jitiCached('./example.ts');
console.timeEnd('First load (cached)');

console.time('Second load (cached)');
jitiCached('./example.ts');
console.timeEnd('Second load (cached)');

console.time('First load (uncached)');
jitiUncached('./example.ts');
console.timeEnd('First load (uncached)');

console.time('Second load (uncached)');
jitiUncached('./example.ts');
console.timeEnd('Second load (uncached)');