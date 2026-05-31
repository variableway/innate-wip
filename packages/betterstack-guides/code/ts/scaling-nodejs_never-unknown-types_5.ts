# Source: https://betterstack.com/community/guides/scaling-nodejs/never-unknown-types/
# Original language: typescript
# Normalized: ts
# Block index: 5

[label src/problem.ts]
type Theme = 'light' | 'dark' | 'auto';

function getThemeStyles(theme: Theme): string {
  switch (theme) {
    case 'light':
      return 'light-styles';
    case 'dark':
      return 'dark-styles';
[highlight]
    case 'auto':
      return 'auto-styles';
    default:
      // This line ensures exhaustiveness
      const exhaustiveCheck: never = theme;
      throw new Error(`Unhandled theme: ${exhaustiveCheck}`);
[/highlight]
  }
}
...
console.log(getThemeStyles('auto')); // Now works correctly