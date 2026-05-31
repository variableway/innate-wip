# Source: https://betterstack.com/community/guides/scaling-nodejs/stylex-metas/
# Original language: typescript
# Normalized: ts
# Block index: 5

[label Card.tsx]
import type { StyleXStyles } from '@stylexjs/stylex';

interface Props {
  // ... other props
[highlight]  style?: StyleXStyles<{
    borderColor?: 'red' | 'blue' | 'green';
    color?: string;
  }>;[/highlight]
}

export function BasicCard({ children, title, style }: Props) {
  return (
    <div {...stylex.props(styles.base, style)}>
      {/* ... */}
    </div>
  );
}