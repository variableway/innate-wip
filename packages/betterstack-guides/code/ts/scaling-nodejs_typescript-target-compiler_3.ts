# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-target-compiler/
# Original language: typescript
# Normalized: ts
# Block index: 3

[label src/modern-syntax.ts]
class DataProcessor {
  async process(items: string[]): Promise<number> {
    const filtered = items.filter(item => item.length > 0);
    const results = await Promise.all(
      filtered.map(async item => item.toUpperCase())
    );
    return results.length;
  }
}

const processor = new DataProcessor();
const count = await processor.process(["hello", "world", ""]);
console.log(`Processed ${count} items`);