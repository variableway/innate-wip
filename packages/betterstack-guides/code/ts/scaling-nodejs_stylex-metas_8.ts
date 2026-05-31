# Source: https://betterstack.com/community/guides/scaling-nodejs/stylex-metas/
# Original language: typescript
# Normalized: ts
# Block index: 8

[label src/themes.ts]
import * as stylex from '@stylexjs/stylex';
import { colors } from './tokens.stylex';

export const dracula = stylex.createTheme(colors, {
    primaryText: 'purple',
    background: '#282a36',
    accent: 'pink',
});

export const cyberpunk = stylex.createTheme(colors, {
    primaryText: '#00ff41',
    background: '#0d0d0d',
    accent: '#ff00ff',
});