# Source: https://betterstack.com/community/guides/scaling-nodejs/stylex-metas/
# Original language: typescript
# Normalized: ts
# Block index: 9

[label component.tsx]
import { dracula } from './themes';

function App() {
  // Apply the Dracula theme to the entire container
  return (
    <div {...stylex.props(dracula, styles.container)}>
        {/* All components inside here will now use the Dracula theme colors */}
    </div>
  );
}