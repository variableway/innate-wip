# Source: https://betterstack.com/community/guides/scaling-nodejs/stylex-metas/
# Original language: typescript
# Normalized: ts
# Block index: 1

[label component.tsx]
function App() {
  return (
    <div {...stylex.props(styles.container)}>
      <button {...stylex.props(styles.button)}>
        Subscribe
      </button>
    </div>
  );
}