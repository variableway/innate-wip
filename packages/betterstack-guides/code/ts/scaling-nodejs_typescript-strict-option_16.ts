# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-strict-option/
# Original language: typescript
# Normalized: ts
# Block index: 16

[label src/strict-checks.ts]
  getAge(): number {
[highlight]
    return this.age ?? 0;
[/highlight]
  }