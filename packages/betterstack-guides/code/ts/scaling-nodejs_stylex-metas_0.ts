# Source: https://betterstack.com/community/guides/scaling-nodejs/stylex-metas/
# Original language: typescript
# Normalized: ts
# Block index: 0

[label component.tsx]
import * as stylex from '@stylexjs/stylex';

const styles = stylex.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    gap: '20px',
  },
  button: {
    borderRadius: '18px',
    borderStyle: 'none',
    paddingBlock: '10px',
    paddingInline: '16px',
    backgroundColor: 'red',
    color: 'white',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 600,
  },
});