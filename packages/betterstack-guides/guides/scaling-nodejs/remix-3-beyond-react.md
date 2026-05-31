# Remix 3 and the Future Beyond React

The JavaScript ecosystem is in a constant state of evolution, with frameworks rising and iterating to meet the ever-growing demands of modern web development. Among the most respected full-stack frameworks is Remix, known for its focus on web standards and exceptional user experience. Recently, the highly anticipated Remix 3 was unveiled, and it's not just an update but a radical new direction. The team has **made the bold decision to move away from its React foundation** and build its own, custom reactivity system from the ground up.

In this article, we'll explore the **experimental Remix 3 framework**. We'll dissect its core philosophy, analyze its unique syntax, and examine how it approaches state management, event handling, and full-stack integration. You'll learn about its explicit update mechanism, custom event interactions, and advanced server-side features like routing and the innovative `<Frame>` component.

Remix 3 is a framework that is both strange and familiar, blending classic web principles with a modern component-based architecture. What's the deal with the ubiquitous `this` keyword? Why are we manually calling `update()`? And are those iframes? Let's dive in and find out what the future of Remix looks like.


<iframe width="100%" height="315" src="https://www.youtube.com/embed/ZXcQR2jZL8s" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## The paradigm shift: Why Remix 3 is moving on from React

In May, the Remix team announced their intention to "own the full stack without leaning on layers of abstraction we don't control." The primary target of this declaration was its dependency on React. The goal for Remix 3 is to deliver a development experience that is faster, simpler, and fundamentally closer to the web platform itself.

This isn't just about replacing one rendering library with another. It's a complete philosophical shift. By creating their own component model and reactivity system, the Remix team gains complete control over the entire request-response lifecycle, from the server to the client. This allows for deeper optimizations and a more cohesive developer experience that aligns perfectly with their vision.

### Core principles of the new Remix

The new direction is guided by several key principles:

- **Simplicity and clarity:** The framework aims to reduce "magic" and make the flow of data and updates more explicit and understandable.
- **Performance:** By cutting out the overhead of a large, general-purpose library like React, Remix can create a smaller, more focused, and faster runtime.
- **Web standards alignment:** Remix 3 leans heavily on native browser APIs and standards like Custom Events, AbortSignal, and the Fetch API. This not only makes the framework more future-proof but also leverages the powerful tools already built into the web platform.

It's important to note that, as of this writing, Remix 3 is still under heavy, active development. Many of its core packages are marked as experimental and are not ready for production use. However, its current state provides a fascinating preview of a potential new path for web development.


## Reactivity in Remix 3: Understanding the component model

The best way to understand Remix 3's client-side architecture is through a simple counter component. Look at how state and updates work:

```typescript
[label src/App.tsx]
export function App() {
  let count = 0;

  return () => (
    <div id="app">
      <h1>Counter</h1>
      <p>Clicks: {count}</p>
      <button>+</button>
      <button>-</button>
    </div>
  );
}
```

Two things immediately stand out here. First, state is just a plain `let count = 0;` variable. **No hooks, no special APIs**. Second, the component **doesn't return JSX directly**—it returns a function that returns JSX. The outer function runs once when the component initializes (like a constructor), while the inner function is what actually renders and re-renders when updates happen.

### Making it interactive with `this` and explicit updates

To make the counter actually work, Remix 3 uses two concepts that feel foreign if you're coming from React: the `this` handle and manual `this.update()` calls.

```typescript
[label src/App.tsx]
import { pressDown } from '@remix-run/events/press';
import type { Remix } from '@remix-run/dom';

export function App(this: Remix.Handle) {
  let count = 0;

  const increment = () => {
    count++;
    this.update();
  };

  const decrement = () => {
    count--;
    this.update();
  };

  return () => (
    <div id="app">
      <h1>Counter</h1>
      <p>Clicks: {count}</p>
      <button on={pressDown(increment)} type="button">+</button>
      <button on={pressDown(decrement)} type="button">-</button>
    </div>
  );
}
```

The function signature `export function App(this: Remix.Handle)` is TypeScript's way of typing the `this` context. In Remix 3, **`this` isn't a class instance** but a handle connecting your component to the framework runtime. It gives you methods for scheduling updates, accessing context, and managing lifecycle events.


![Screenshot of the app being bulit](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/19fe83bc-7b91-4e3a-4ae4-6d7422bf4b00/md1x =2918x1606)

After incrementing or decrementing `count`, the code explicitly calls `this.update()`. This is the manual reactivity trigger. Since `count` is just a regular variable, Remix can't automatically detect changes. The `this.update()` call tells the scheduler to re-run the render function.

Compare this to React or Vue where updates happen automatically. Remix **trades that implicit magic for explicit control**. More verbose? Sure. But also more predictable—you know exactly when and why re-renders happen.

Event listeners use an `on` prop instead of `onClick`. The `pressDown` interaction bundles mouse clicks, spacebar, and Enter key presses into one unified event. It's accessibility built in by default, so interactive elements work for keyboard users without extra code.

With this setup, the counter works. Click a button, `count` changes, `this.update()` fires, and the DOM reflects the new value. Simple, explicit, predictable.

## Advanced interactions: Custom event logic with `createInteraction`

Beyond simple button clicks, Remix 3 lets you build custom, reusable event logic through `createInteraction`. Take a BPM tapper as an example: users tap a button repeatedly, and the component calculates the tempo based on the timing between taps.

![Screenshot of the BPM tapper](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/caf224c5-7769-42f7-bc3e-138439c7ce00/lg2x =2928x1594)

### Defining a custom interaction

Here's how you'd build a tempo detection interaction:

```typescript
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
```

The `createInteraction` factory takes a unique name and a setup function. That setup function receives two things: `target` (the DOM element) and `dispatch` (a wrapper around the browser's native `CustomEvent` API).

Inside, the `handleTap` function tracks timestamps, filters out old taps beyond 4 seconds, calculates intervals between taps, and computes the average BPM. Once there are enough data points, it fires a custom event via `dispatch({ detail: avgTempo })`. The `detail` property is how you pass data with custom events in the browser.

The setup function returns `events(target, [pressDown(handleTap)])`, which binds the logic to the element and handles cleanup when the component unmounts.

### Using the custom interaction

Once defined, you use it exactly like any built-in interaction:

```typescript
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
```

The `on` prop takes the `tempo` interaction, the callback receives the custom event, and `event.detail` contains the calculated BPM. Update the variable, call `this.update()`, and the UI reflects the change.

What's elegant here is how closely it maps to web standards. You're building declarative wrappers around the DOM's native event system. The result is reusable, composable interaction logic that works with the platform instead of against it.

## Full-stack Remix 3

Remix 3 isn't just about the client side. It maintains the framework's full-stack heritage with deeper server-client integration than before.

### Server-side routing

The routing system supports both file-based and configuration-based approaches. A `routes.ts` file can declare static routes, dynamic segments, and even "fragments" for partial page updates:

```typescript
[label routes.ts]
export const routes = {
  home: route('/'),
  about: route('/about'),
  blog: {
    index: route('/blog'),
    post: route('/blog/:slug'),
  },
  fragments: {
    bookCard: route('/fragments/book/:slug'),
  },
};
```

This router runs anywhere JavaScript does: Node.js, Bun, Cloudflare Workers, you name it. Just wrap it in a server entry point for your target environment.

### Progressive enhancement with `<Frame>`

The `<Frame>` component might be the most interesting piece. Think React's `<Suspense>`, but URL-based like an `<iframe>`:

```typescript
{books.map((book) => (
  <Frame
    key={book.slug}
    fallback={<div>Loading...</div>}
    src={routes.fragments.bookCard.href({ slug: book.slug })}
  />
))}
```

Here's what happens: `<Frame>` renders the fallback first, then fetches the URL in the `src` prop. The server renders just that route fragment as HTML and streams it back. The component swaps out the fallback for the real content.

It's progressive enhancement in the HTMX or Turbo Frames tradition. Instead of fetching JSON and rendering client-side, you get pre-rendered HTML. Less JavaScript to parse and execute, faster time to interactive, and it works even if JavaScript fails to load.

## Final thoughts

Remix 3 is a radical reimagining of web frameworks. By ditching React, the team gets complete control over the stack, building something smaller, faster, and closer to the web platform itself.

The learning curve is real. Manual `this.update()` calls and functions-returning-functions feel strange coming from React or Vue. But the explicitness brings clarity. You know exactly when and why things update. No hidden reactivity system, no magic, just straightforward cause and effect.

The **commitment to web standards** stands out. Custom Events, native browser APIs, HTML-over-the-wire with `<Frame>`. These choices suggest a framework betting on the platform's future rather than abstracting it away.

Is it production-ready? Not yet. Will it win over developers used to implicit reactivity? Hard to say. But Remix 3 is asking important questions about what we actually need from frameworks and whether we've been overcomplicating things. That alone makes it one of the most interesting experiments in JavaScript today.