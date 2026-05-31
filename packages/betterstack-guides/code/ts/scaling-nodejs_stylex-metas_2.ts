# Source: https://betterstack.com/community/guides/scaling-nodejs/stylex-metas/
# Original language: typescript
# Normalized: ts
# Block index: 2

[label component.tsx]
const styles = stylex.create({
  button: {
[highlight]    backgroundColor: {
      default: 'red',
      ':hover': '#cc0000',
    },[/highlight]
    color: 'white',
    // ... other styles
  },
  container: {
[highlight]    backgroundColor: {
        default: 'white',
        '@media (prefers-color-scheme: dark)': 'black',
    },[/highlight]
    // ... other styles
  }
});