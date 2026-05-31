# Source: https://betterstack.com/community/guides/scaling-nodejs/never-unknown-types/
# Original language: typescript
# Normalized: ts
# Block index: 6

[label src/problem.ts]
[highlight]
type Theme = 'light' | 'dark' | 'auto' | 'contrast';
[/highlight]

// Keep the same getThemeStyles function...
function getThemeStyles(theme: Theme): string {
 ...
}
...