# Building Ultra-Fast Desktop Apps with Electrobun


Desktop application development has long been dominated by [Electron](https://www.electronjs.org/), a framework that lets web developers ship apps using familiar JavaScript tooling. The tradeoff is well known: **Electron** bundles an entire copy of the Chromium browser and the Node.js runtime, resulting in **large application sizes, high memory usage, and slow startup times**. Alternatives like [Tauri](https://tauri.app/) improved on this by using the system's native WebView and writing the backend in Rust, but that introduced its own learning curve.

[Electrobun](https://electrobun.dev/) takes a different approach. It uses the **system's native WebView to keep bundle sizes small, but writes everything**, including the backend process, in TypeScript. The runtime powering the backend is [Bun](https://bun.sh/) rather than Node.js, which contributes to its notably fast startup times and lean memory footprint.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/ONFLLhNfcx4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## What is Electrobun?

Electrobun is a desktop application framework that aims to be a complete solution for building, updating, and shipping cross-platform apps entirely in TypeScript. Its architecture rests on two main decisions: using Bun as the runtime for the main process, and delegating rendering to the native WebView provided by the host operating system rather than bundling a browser engine.

On macOS, the native WebView is **WebKit** (the engine behind Safari). On Windows, it is **Edge WebView2**, which is Chromium-based. On Linux, it is **WebKitGTK**. Because these rendering engines differ across platforms, developers need to test their UIs on each target platform to ensure a consistent appearance.

For lower-level operating system integration such as window management, system trays, and native menus, Electrobun relies on native bindings written in C++, Objective-C++, and Zig. These are exposed through a TypeScript API, so application developers never have to write any low-level code themselves.

## Performance characteristics

The architectural choices above translate into measurable differences in bundle size, update size, startup time, and memory usage when compared to Electron and Tauri.

| Metric | Electron | Tauri | Electrobun |
|---|---|---|---|
| Bundle size | ~150 MB | ~25 MB | ~14 MB |
| Update size | ~100 MB | ~10 MB | ~14 KB |
| Startup time | 2–5 seconds | ~500 ms | <50 ms |
| Memory usage | 100–200 MB | 30–50 MB | 15–30 MB |

![Performance comparison table for Electron, Tauri, and Electrobun across bundle size, update size, startup time, and memory usage](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/39734ef3-9ea7-4e09-88e8-916397ba4300/orig =1920x1080)

The bundle size difference is a direct consequence of not bundling a browser engine. A simple React application packaged with Electrobun produces an app around **64 MB**, compared to roughly **271 MB** for a comparable Electron build.

The update size figure is perhaps the most striking. Electrobun ships a differential update system that produces patches as small as 14 KB by only sending what has changed between versions, rather than replacing entire runtime components.

Startup speed comes largely from Bun itself. Bun uses the JavaScriptCore engine (also used by Safari) and is designed around fast startup from the ground up, which allows Electrobun apps to feel nearly instant when launching.

## Project configuration with `electrobun.config.ts`

An Electrobun project is controlled by a `electrobun.config.ts` file at the project root. This defines application metadata, the entry point for the main process, and how frontend views are built and served.

A minimal configuration looks like this:

```typescript
[label electrobun.config.ts]
export default {
  app: {
    name: "My App",
    identifier: "dev.my.app",
    version: "0.0.1",
  },
  build: {
    bun: {
      entrypoint: "src/bun/index.ts",
    },
  },
  views: {
    main: {
      entrypoint: "src/index.html",
    },
  },
};
```

The `app` section provides metadata. The `build.bun.entrypoint` tells Electrobun which TypeScript file to run as the main process using Bun. The `views` object registers named views: Electrobun bundles each view's HTML file and its dependencies, then makes them available via the `views://` protocol.

## The main process and `BrowserWindow`

The main process is a regular TypeScript file run by Bun. It controls the application lifecycle, creates windows, and handles communication with the frontend. The entry point is whatever file is specified in `build.bun.entrypoint`.

Creating a window is done by instantiating `BrowserWindow` from `electrobun/bun`:

```typescript
[label src/bun/index.ts]
import { BrowserWindow } from "electrobun/bun";

new BrowserWindow({
  title: "Hello Electrobun",
  url: "views://main/index.html",
});
```

The `url` field uses the `views://` protocol followed by the view name (as defined in `electrobun.config.ts`) and the HTML filename. Electrobun resolves this to the bundled output of the corresponding view entrypoint.

## Setting up a React frontend

The frontend is a standard HTML/TypeScript project. For a React app, `src/index.html` serves as the shell, `src/frontend.tsx` mounts the React root, and `src/App.tsx` holds the application component.

```html
[label src/index.html]
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>My App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="./frontend.tsx"></script>
  </body>
</html>
```

```tsx
[label src/frontend.tsx]
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

```tsx
[label src/App.tsx]
import React from "react";

function App() {
  return (
    <div>
      <h1>Welcome to Electrobun</h1>
      <p>This React component is rendering inside a native desktop window.</p>
    </div>
  );
}

export default App;
```

Electrobun bundles these files during the build step and serves them through the `views://` protocol when the window loads.

## Initializing a project with `bunx electrobun init`

Rather than configuring everything manually, Electrobun provides an interactive scaffolding command:

```command
bunx electrobun init
```

![Terminal output from bunx electrobun init showing a list of available project templates including svelte, vue, angular, solid, react-tailwind-vite, multi-window, tray-app, notes-app, photo-booth, hello-world, and tailwind-vanilla](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/e09817ba-6b88-4c58-adc5-faec755e8200/orig =1920x1080)

This presents a list of official templates covering common patterns including frontend framework starters (`svelte`, `vue`, `react-tailwind-vite`, `angular`, `solid`), application patterns (`tray-app`, `multi-window`, `notes-app`, `photo-booth`), and minimal baselines (`hello-world`, `tailwind-vanilla`). These templates are a useful reference for understanding how Electrobun structures different types of applications.

For projects that need specific dependency control or custom build pipelines, starting from the manual configuration described above gives more explicit control over each layer.

## Development workflow

The typical `package.json` setup for an Electrobun project separates the initial build from the development server:

```json
[label package.json]
{
  "name": "my-app",
  "scripts": {
    "dev": "bun run build:dev && electrobun dev",
    "build:dev": "bun install && electrobun build"
  },
  "dependencies": {
    "electrobun": "^1.14.4",
    "react": "^19",
    "react-dom": "^19"
  },
  "devDependencies": {
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@types/bun": "latest"
  }
}
```

[highlight]
    "dev": "bun run build:dev && electrobun dev",
[/highlight]

![Close-up of the scripts section in package.json showing the dev and build:dev commands](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/9af82e97-368b-460b-5420-bb3482cb1700/lg1x =1920x1080)

The `dev` script runs a full build first, then starts `electrobun dev`, which watches for changes and provides hot reloading during development.

## Native window customization

### Hiding the title bar

The default OS title bar can be suppressed with `titleBarStyle`, which gives the application a more custom, frameless appearance:

```typescript
[label src/bun/index.ts]
new BrowserWindow({
  title: "My App",
  url: "views://main/index.html",
[highlight]
  titleBarStyle: "hiddenInset",
[/highlight]
});
```

With `hiddenInset`, the title bar is hidden but the window still has the standard traffic light buttons in the top-left corner on macOS. The HTML content extends into the area where the title bar would have been.

### Custom application menus

Native menus are defined using the `ApplicationMenu` API:

```typescript
[label src/bun/index.ts]
import { BrowserWindow, ApplicationMenu } from "electrobun/bun";

new BrowserWindow({
  title: "My App",
  url: "views://main/index.html",
});

ApplicationMenu.setApplicationMenu({
  mac: {
    app: [
      { label: "Quit", role: "quit" },
    ],
    edit: [
      { label: "Undo", role: "undo" },
      { label: "Redo", role: "redo" },
    ],
  },
});
```

![Code snippet showing ApplicationMenu.setApplicationMenu with labels, submenus, and role values for macOS](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/57af2e3e-9323-4560-8b83-9ddf417bab00/md2x =1920x1080)

Menu entries can use built-in `role` values (which map to standard OS behaviors like `quit`, `undo`, or `redo`), or they can trigger custom callbacks defined in the main process. Platform-specific menus can be defined under separate keys, allowing you to adapt the menu structure to macOS and Windows conventions independently.

## Production builds

A production build is triggered with the `build` command and an environment flag:

```command
bun run electrobun build --env=stable
```

Output is placed in the `artifacts` directory. On macOS, this includes a `.app` bundle and a `.dmg` disk image. The build process handles optimization, packaging, and code signing.

The differential update system mentioned earlier becomes relevant at this stage. When a new version is released, Electrobun can generate a patch file representing only what changed between the current and previous builds. Because the update payload excludes large runtime components that haven't changed, patches can be orders of magnitude smaller than a full application download.

![Side-by-side file explorer view showing a packaged Electrobun app at 64.5 MB next to an equivalent Electron app at 271.1 MB](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/af10ea36-858e-4c2d-bb99-0a396bcc9400/orig =1920x1080)

## Tradeoffs to consider

Electrobun's use of system WebViews is what makes its bundle sizes possible, but it comes with a real tradeoff: rendering behavior is not uniform across platforms. WebKit on macOS, Edge WebView2 on Windows, and WebKitGTK on Linux implement web standards with varying levels of completeness and quirks. Applications need to be tested on each platform, and some CSS or JavaScript features may behave differently or require polyfills.

The framework is also relatively young. Its documentation and community ecosystem are still developing, which means some rough edges exist that would be smoothed out in a more mature framework. For production applications with complex requirements, it is worth tracking the project's progress and evaluating stability before committing to it as a core dependency.

For developers building utility tools, background apps, or any application where bundle size and startup speed are priorities, Electrobun's approach is technically sound and the performance gains are substantial.

## Final thoughts

Electrobun offers a credible alternative to Electron for TypeScript developers who want native desktop distribution without the overhead of a bundled browser engine. **Its integration of Bun as the main process runtime, system WebViews for rendering, and a differential update mechanism** together produce applications that are significantly smaller and faster than what Electron delivers.

The framework is most compelling for developers already comfortable with TypeScript and the Bun ecosystem, since the entire application, **both main process and frontend, can be written in one language without reaching for Rust** or any other compiled language. As the project matures, it is likely to become an increasingly practical choice for production desktop development.

You can follow Electrobun's progress and explore its full API in the [official documentation](https://electrobun.dev/).