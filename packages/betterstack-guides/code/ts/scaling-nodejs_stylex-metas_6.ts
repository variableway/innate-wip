# Source: https://betterstack.com/community/guides/scaling-nodejs/stylex-metas/
# Original language: typescript
# Normalized: ts
# Block index: 6

[label Card.tsx]
import type { StyleXStylesWithout } from '@stylexjs/stylex';

interface Props {
  // ... other props
[highlight]  style?: StyleXStylesWithout<{
    // Disallow changing these properties
    margin: unknown;
    padding: unknown;
    display: unknown;
  }>;[/highlight]
}