# Source: https://betterstack.com/community/guides/scaling-nodejs/stylex-metas/
# Original language: typescript
# Normalized: ts
# Block index: 7

[label src/tokens.stylex.ts]
import * as stylex from '@stylexjs/stylex';

export const colors = stylex.defineVars({
  primaryText: { default: 'black', '@media (prefers-color-scheme: dark)': 'white' },
  background: { default: 'white', '@media (prefers-color-scheme: dark)': 'black' },
  accent: { default: 'blue', '@media (prefers-color-scheme: dark)': 'lightblue' },
});

export const spacing = stylex.defineVars({
  none: '0px',
  small: '4px',
  medium: '8px',
  large: '16px',
});