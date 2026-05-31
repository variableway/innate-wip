# Source: https://betterstack.com/community/guides/scaling-nodejs/stylex-metas/
# Original language: typescript
# Normalized: ts
# Block index: 3

[label component.tsx]
const styles = stylex.create({
  red: {
    color: 'red',
    fontSize: '24px',
  },
  blue: {
    color: 'blue',
    fontWeight: 700,
  }
});

// In your component:
<h1 {...stylex.props(styles.red, styles.blue)}>Hello World</h1>