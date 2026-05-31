# GitHub's Storybook Performance Panel: Component-Level Performance Testing

Performance issues discovered late in the development cycle are expensive to fix. **By the time a slowdown shows up in a staging environment**, it is often rooted in architectural decisions made weeks earlier, spread across multiple components, and difficult to isolate. GitHub's [Storybook Addon Performance Panel](https://github.com/github/storybook-addon-performance-panel) addresses this by embedding a detailed performance dashboard directly into [Storybook](https://storybook.js.org/), where components are developed in isolation.

The **addon measures frame timing, input responsiveness, layout stability,** React-specific rendering behavior, and memory pressure at the component level, during development rather than after integration.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/fv9wj8nkDVM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Shift-left performance testing

The philosophy behind the addon is shift-left testing: moving performance analysis earlier in the development process rather than treating it as a pre-launch concern.

![Diagram comparing the shift-left testing approach with the traditional testing approach, showing testing integrated early and often in the modern method](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/cca50ea7-3884-4a7a-e593-1757f1136b00/lg2x =1280x720)

In a traditional workflow, performance issues surface during integration or QA, at which point the fix often requires revisiting components that have already been shipped to other parts of the codebase. Testing components individually during development makes the feedback loop tighter and the fixes cheaper. A render cascade or memoization problem is straightforward to correct when it's caught in a single component; it becomes significantly harder after that component has been composed into a larger feature.

Storybook is already the standard environment for isolated component development. Adding performance instrumentation to that environment means developers can observe the impact of a code change on frame rate, blocking time, or memory usage without switching tools or waiting for a full application build.

## Key metrics

### Frame timing

Frame timing metrics describe the smoothness of animations and interactions. The target is a stable 60 frames per second, which requires each frame to render in 16.7 milliseconds or less.

The panel tracks FPS, per-frame render time, dropped frames (frames the browser skipped because they took too long), and frame jitter. Jitter measures the inconsistency between frame times. A component can maintain an acceptable average FPS while still feeling stuttery if individual frame durations vary significantly. Frame stability expresses this as a percentage score: a low stability score with an otherwise acceptable FPS indicates an intermittent bottleneck rather than a consistent one.

### Main thread health

The browser's main thread handles JavaScript execution, style calculation, layout, and painting. When it is occupied, the UI cannot respond to user input.

**Total Blocking Time (TBT)** is one of Google's Core Web Vitals and measures the total duration during which the main thread was blocked by long-running tasks. High TBT is usually caused by expensive JavaScript that runs synchronously without yielding to the browser.

**DOM churn** occurs when code repeatedly creates, removes, or updates large numbers of DOM nodes in a tight loop. Each modification can trigger cascading browser work, and the cumulative cost adds up quickly.

![Illustration showing how a tight loop of creating, deleting, and updating elements leads to DOM churn and performance degradation](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/5ce639ad-bf20-4c97-bc07-ec17f850c700/lg2x =1280x720)

**Layout thrashing** is a specific pattern where JavaScript alternates between writing to the DOM and reading layout properties such as `offsetWidth` or `getBoundingClientRect`. Each read after a write forces the browser to recalculate layout synchronously before returning the value. Doing this repeatedly within a single frame serializes what should be batched work and can freeze the UI entirely.

![Flowchart showing how alternating between writing and reading styles forces multiple layout recalculations, resulting in layout thrashing](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/de869cab-7ee2-4c8f-1b80-2cbde77b5f00/public =1280x720)

### React-specific metrics

When React is detected, the panel adds a dedicated section with framework-level profiling.

**Render cascades** track nested updates triggered during the commit phase. A common source of cascades is calling `setState` inside a `useLayoutEffect` hook. Because `useLayoutEffect` runs synchronously before the browser paints, a state update inside it triggers an immediate re-render before the initial update has been displayed, doubling the rendering work for a single interaction.

**P95 duration** reports the 95th percentile render time rather than the mean. Averages hide outliers; P95 captures what the slowest 5% of renders look like, which is a more accurate representation of the worst-case user experience.

**Work saved by memoization** shows what percentage of re-renders were skipped because `React.memo` or `useMemo` determined the output had not changed. A low percentage here means memoization is in place but not actually preventing unnecessary renders, usually because props that appear stable are being recreated on each parent render.

## Installation

The addon is installed into an existing Storybook project via npm:

```command
npm install @github/storybook-addon-performance-panel
```

Then register it in `.storybook/main.js`:

```javascript
[label .storybook/main.js]
module.exports = {
  addons: [
[highlight]
    '@github/storybook-addon-performance-panel',
[/highlight]
  ],
};
```

After restarting the Storybook server, a **Performance** tab appears in the addons panel.

## Analyzing components in practice

### Healthy animation baseline

A component with a simple CSS animation running at a stable 60 FPS shows consistently green metrics across the panel: frame time well under 16.7ms, no dropped frames, high frame stability. This establishes a baseline for what the panel looks like when there is nothing to fix.

### Large filtered list

A list component that filters a large dataset on every keystroke produces a recognizable set of symptoms. CLS (Cumulative Layout Shift) rises as items shift position during re-renders. DOM churn spikes because each keystroke removes and re-adds a large number of list nodes. Dropped frames appear as the combination of JavaScript filtering and DOM manipulation saturates the main thread.

### Expensive renders and memoization

A component that performs heavy synchronous computation on each render shows a high P95 duration and elevated TBT. Frame jitter warnings appear alongside the blocking time increase, reflecting the inconsistent cadence of rendering while the main thread is occupied by long-running scripts.

The memoization case is particularly instructive. Two lists with the same visual output but different memoization implementations produce starkly different "Work Saved" readings. A broken memoization setup, where props objects are recreated on each parent render, shows 0% work saved despite `React.memo` being present. The correctly memoized version shows 83% or higher, with the panel confirming that the majority of child renders are being skipped.

![The Work Saved metric showing a high percentage, illustrating the efficiency gained from correct component memoization](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/50b96f60-cbd8-4ca9-5bb6-31b9b9825300/lg1x =1280x720)

### Render cascades and style churn

A component that calls `setState` inside `useLayoutEffect` increments the cascade counter with each interaction, making the synchronous re-render loop visible. The panel's distinction between `useEffect` (which runs after paint) and `useLayoutEffect` (which runs before paint) makes clear why the latter causes cascades when it triggers state updates.

![Diagram comparing the execution flow of useEffect and useLayoutEffect, clarifying why useLayoutEffect can cause render cascades when state is updated within it](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/2c4cc149-f36c-410b-4a87-785980335700/md2x =1280x720)

A component that rapidly mutates the inline styles of hundreds of DOM nodes produces stall warnings under the thrashing metric. The constant alternation between style writes and layout reads blocks the main thread and can freeze the UI entirely while the browser works through the queue of forced recalculations.

## Final thoughts

The Storybook Performance Panel makes performance analysis available at the same point in development where the decisions that determine performance are actually made. **Frame timing, layout thrashing, memoization effectiveness, and render cascades** are all measurable inside Storybook before any code is integrated into a larger application.

The metrics are framework-aware for React, which covers the majority of component-driven development workflows, and the **panel's use of P95 rather than mean durations reflects how production performance** is actually experienced. For teams using Storybook as part of their development workflow, the addon is a straightforward addition with meaningful diagnostic value.

The project is maintained on [GitHub](https://github.com/github/storybook-addon-performance-panel) where you can track updates and file issues.