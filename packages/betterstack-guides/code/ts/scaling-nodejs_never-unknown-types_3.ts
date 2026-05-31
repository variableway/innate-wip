# Source: https://betterstack.com/community/guides/scaling-nodejs/never-unknown-types/
# Original language: typescript
# Normalized: ts
# Block index: 3

[label src/problem.ts]
type Theme = 'light' | 'dark' | 'auto';

function getThemeStyles(theme: Theme): string {
  switch (theme) {
    case 'light':
      return 'light-styles';
    case 'dark':
      return 'dark-styles';
    // Missing 'auto' case - no compile-time error!
  }
  // Function might return undefined at runtime
}

// External API data with unknown structure
function processApiResponse(data: any): User {
  return {
    id: data.id,     // Could be undefined or wrong type
    name: data.name, // Could be missing
  };
}

type User = { id: number; name: string; };

console.log(getThemeStyles('auto')); // undefined at runtime