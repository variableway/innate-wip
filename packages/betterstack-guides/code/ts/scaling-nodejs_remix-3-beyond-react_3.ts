# Source: https://betterstack.com/community/guides/scaling-nodejs/remix-3-beyond-react/
# Original language: typescript
# Normalized: ts
# Block index: 3

[label src/BPMBtn.tsx]
import type { Remix } from '@remix-run/dom';
import { tempo } from './tempo';

export function BPMBtn(this: Remix.Handle) {
  let bpm = 60;

  return () => (
    <button
      type="button"
[highlight]      on={tempo((event) => {
        bpm = event.detail;
        this.update();
      })}[/highlight]
    >
      BPM: {bpm}
    </button>
  );
}