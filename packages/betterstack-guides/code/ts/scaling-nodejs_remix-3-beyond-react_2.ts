# Source: https://betterstack.com/community/guides/scaling-nodejs/remix-3-beyond-react/
# Original language: typescript
# Normalized: ts
# Block index: 2

[label src/tempo.tsx]
import { createInteraction, events } from '@remix-run/events';
import { pressDown } from '@remix-run/events/press';

export const tempo = createInteraction<HTMLElement, number>('rmx:tempo', ({ target, dispatch }) => {
  let taps: number[] = [];
  let resetTimer: number = 0;

  function handleTap() {
    clearTimeout(resetTimer);
    taps.push(Date.now());
    taps = taps.filter((tap) => Date.now() - tap < 4000);

    if (taps.length >= 4) {
      const intervals = [];
      for (let i = 1; i < taps.length; i++) {
        intervals.push(taps[i] - taps[i - 1]);
      }

      const avgInterval = intervals.reduce((sum, val) => sum + val, 0) / intervals.length;
      const avgTempo = Math.round(60000 / avgInterval);

[highlight]      dispatch({ detail: avgTempo });[/highlight]
    }

    resetTimer = window.setTimeout(() => {
      taps = [];
    }, 4000);
  }
  
[highlight]  return events(target, [pressDown(handleTap)]);[/highlight]
});