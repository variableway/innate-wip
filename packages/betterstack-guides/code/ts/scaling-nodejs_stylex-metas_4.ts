# Source: https://betterstack.com/community/guides/scaling-nodejs/stylex-metas/
# Original language: typescript
# Normalized: ts
# Block index: 4

[label component.tsx]
import { useState } from 'react';
import * as stylex from '@stylexjs/stylex';

// ... styles definition for 'red' and 'blue'

function App() {
  const [useRed, setUseRed] = useState(true);

  return (
    <div>
[highlight]      <h1 {...stylex.props(useRed && styles.red, !useRed && styles.blue)}>
        Color me!
      </h1>[/highlight]
      <button onClick={() => setUseRed(!useRed)}>Toggle Color</button>
    </div>
  );
}