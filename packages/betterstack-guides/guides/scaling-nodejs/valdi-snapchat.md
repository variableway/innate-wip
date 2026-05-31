# A Look into Valdi: Snapchat's UI Framework

Mobile and desktop app development keeps evolving, and developers are always looking for frameworks that deliver native performance without slowing them down. React Native and Flutter get most of the attention these days, but there's a new player that came from an unexpected place. **Valdi is the cross-platform UI framework that's been quietly running Snapchat's apps for the past eight years, and it just went open source.**

Valdi lets you write your UI once in TypeScript and compile it straight to native views on iOS, Android, and macOS. It comes with instant hot reloading, solid VS Code debugging, and a well-thought-out architecture. **The big selling point? It completely skips the JavaScript bridge that other frameworks use, which means better performance.**

This article takes a close look at Valdi. You'll see how it's built, what technologies power it, and how its component model works. **There's also an important question to answer: why would Snapchat spend eight years building their own framework instead of just using React Native?** Understanding the history behind Valdi helps explain where it fits in today's cross-platform world.


<iframe width="100%" height="315" src="https://www.youtube.com/embed/ZlCV1QLIRQs" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## What is Valdi?

Valdi is a cross-platform UI framework built to tackle two main problems: performance and developer experience. Most frameworks either run JavaScript code at runtime or use a "bridge" to talk to native components. Valdi does something different. It compiles your TypeScript code directly into native platform code, so what you end up with is basically a native app.

### Native performance without sacrificing velocity

Valdi's main idea is compiling first, asking questions later. When you build a Valdi app, your TypeScript and JSX-style code doesn't just get bundled up. It gets converted into the actual native languages and UI components for whatever platform you're targeting.

On iOS, your code turns into native UIKit views. On Android, it becomes Android View system components. On macOS, you get AppKit views that feel like real desktop apps.

Getting rid of the JavaScript bridge matters because that bridge has always been a performance problem. Without it, you get smoother animations, faster responses, and better memory usage. Your app runs like it was written in Swift or Kotlin from the start.

But Valdi doesn't make you sacrifice speed for performance. It uses TypeScript, which millions of web and Node.js developers already know. Features like hot reloading and integrated debugging mean you can iterate fast without waiting through long recompilation cycles like you would with pure native development.

![A list of Valdi's feature highlights, including the Flexbox layout system, native animations, and Bazel integration.](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/3311e042-dc7f-4648-b587-1fa124af3800/md2x =1920x1080)

### Key features at a glance

Snapchat has been running Valdi in production for almost a decade, and you can tell from the features:

- **Declarative TypeScript syntax**: You write UI with familiar JSX-style syntax inside TypeScript classes
- **Flexbox layout system**: Uses Facebook's Yoga layout engine to give you consistent Flexbox layouts across all platforms
- **True native compilation**: No web views, no JavaScript bridges. Your code runs directly on the platform
- **Instant hot reloading**: Changes show up in your simulator or device right away, which speeds up development considerably
- **Full VS Code debugging support**: Set breakpoints, check variables, step through your TypeScript code while it runs
- **Worker threads**: Run JavaScript on multiple threads so you can do heavy work without freezing the UI
- **Advanced gesture recognition**: Handles gestures using native platform APIs for smooth interactions
- **Bazel integration**: Uses Google's Bazel build system for fast, consistent builds

## The technology stack: A look under the hood

Valdi isn't one big monolithic system. It's several powerful open-source tools working together. Understanding these pieces helps you appreciate what Valdi can do.

### TypeScript: The foundation of Valdi apps

Valdi apps are written in TypeScript. You build components as TypeScript classes, which gives you strong typing and object-oriented features. This choice makes sense for Snapchat. When you have a massive app with tons of developers working on it, TypeScript's type safety and organization are essential. Valdi adds JSX-style syntax for defining UI and decorators for metadata.

### Bazel: The orchestrator of builds

Bazel might be the most important part of Valdi. It's an open-source build tool from Google designed for huge projects with multiple languages, which is exactly what Valdi needs.

Bazel matters because a Valdi project involves compiling TypeScript, linking C++ code, and building native iOS, Android, and macOS projects all at once. Bazel coordinates this whole process. It knows how everything in your project depends on everything else, from a single TypeScript file to a native library. It only rebuilds what actually changed.

This gives you reproducible builds where everyone on your team gets the same binary from the same code. No more "works on my machine" problems. You also get incremental builds. After your first build, the next ones are super fast because Bazel caches everything and only reruns what's necessary. Bazel was built for Google's monorepo with millions of files, so it can definitely handle any Valdi app you throw at it.

### Djinni and Yoga: Bridging worlds and structuring layouts

Valdi uses a couple other important libraries to make cross-platform work:

**Djinni**: Dropbox originally created this tool to generate bridging code between C++ and other languages like Java (Android) and Objective-C (iOS). Valdi uses its own version of Djinni to define cross-platform types and interfaces in C++, which you can then use seamlessly in your TypeScript code.

**Yoga**: Facebook created Yoga, and it's also used in React Native. Yoga is a cross-platform layout engine that implements Flexbox from CSS. By using Yoga, Valdi makes sure your layout code works the same on iOS, Android, and macOS. This is how Valdi gives you familiar CSS-like styling for positioning and sizing.

![A code snippet demonstrating how styles are defined in Valdi using a `Style<View>` object, with properties like `backgroundColor` and `justifyContent`.](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/331621f6-a634-4a87-ef48-725b90205100/lg2x =1920x1080)

### Skia: The graphics powerhouse

For 2D graphics, Valdi uses Skia, which is Google's open-source graphics library. Skia powers Google Chrome, ChromeOS, Android, and Flutter. Having Skia means Valdi gets high-performance graphics that work consistently across all platforms for drawing shapes, text, and images.

## Writing Valdi components: A conceptual overview

If you've worked with React class components, Valdi syntax will feel very familiar. This is intentional. It makes it easier for web developers to move into native development.

![The "Quick Example" from Valdi's GitHub page, showing a complete, basic `HelloWorld` component.](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/2789af78-c69b-4b4f-92a3-0fd99af6be00/md1x =1920x1080)

### The component structure

A Valdi component is a TypeScript class that extends either `Component` or `StatefulComponent`:

```typescript
[label HelloWorld.tsx]
import { Component } from 'valdi_core/src/Component';

class HelloWorld extends Component {
  onRender() {
    const message = 'Hello World! 🗺️';
    return (
      <view backgroundColor="#FFFC00" padding={30}>
        <label color="black" value={message} />
      </view>
    );
  }
}
```

The component is a class called `HelloWorld` with an `onRender()` method. This works just like React's `render()` method and returns what the UI should look like.

The UI uses syntax that looks exactly like JSX. The `<view>` and `<label>` elements are core Valdi components.

![A table mapping Valdi elements like `<view>` and `<label>` to their native counterparts, `ViewGroup`/`UIView` and `TextView`/`UITextView` respectively](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/3c2f027b-0be1-4cf9-37bd-04a613299000/lg2x =1920x1080)

These aren't HTML elements though. They're abstractions that Valdi's compiler maps to real native UI components. A `<view>` becomes a `UIView` on iOS and a `ViewGroup` on Android. A `<label>` becomes a `UILabel` and a `TextView`.

### Managing state and lifecycle

When you need to manage state, you extend `StatefulComponent` instead. The lifecycle methods are similar to React but with different names.

The `onCreate()` method runs when the component first mounts. It's like `componentDidMount` in React and is good for setting up event listeners or fetching data. The `onDestroy()` method runs when the component unmounts, similar to `componentWillUnmount`. This is where you clean up things like event listeners. Just like React, you use `this.setState()` to update state, which triggers a re-render.

Here's a fuller example:

```typescript
[label App.tsx]
export class App extends StatefulComponent<AppViewModel, AppComponentContext> {
  state: State = { hotReloaderConnected: false };

  onCreate(): void {
    console.log('On App create!');
    getDaemonClientManager().addListener(this);
  }

  onDestroy(): void {
    console.log('On App destroy!');
    getDaemonClientManager().removeListener(this);
  }

  onAvailabilityChanged(available: boolean): void {
    this.setState({ hotReloaderConnected: available });
  }

  onRender(): void {
    console.log('On App render!');
    return (
      <view style={styles.main}>
        <image style={styles.logo} src={res.valdi} />
        <layout padding={20}>
            <label style={styles.title} value={'Welcome to Valdi!'} />
        </layout>
        <label style={styles.subtitle} value={this.renderLabel()} />
      </view>
    );
  }

  private renderLabel(): AttributedText {
    // ... logic to return text based on platform
  }
}
```

![A close-up of the `onRender` method in a more complex component, showing nested elements like `<view>`, `<image>`, and `<layout>`.](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/ea313869-938f-43a3-e8d2-f5ef0bc56800/lg2x =1920x1080)

This structure is clear and organized. It makes the code easy to understand for developers who know modern frontend frameworks.

## Valdi vs. React Native: A tale of two timelines

To really understand Valdi, you need to know why Snapchat spent so much time building it when React Native already existed. The answer is about timing. Cross-platform development was very different eight years ago.

### The world when Valdi was born (circa 2016-2018)

When Snapchat started building Valdi, React Native was still pretty new and had some serious problems that made it unusable for an app as demanding as Snapchat.

**The JavaScript bridge bottleneck**: Early React Native relied on an asynchronous bridge to communicate between the JavaScript thread (where your app logic ran) and the native UI thread. Every UI update and every event had to be packaged up, sent across this bridge, and unpacked on the other side. For complex things like animations or tracking gestures, this bridge became a major bottleneck. You'd get dropped frames and janky animations.

![A screenshot of a GitHub issue from 2018 titled "React-native: why JS bridge is the performance bottleneck," perfectly illustrating the problem Valdi was designed to solve.](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/e65012f8-cb2d-46cf-25de-2de414ff2800/public =1920x1080)

**No first-class desktop support**: React Native only focused on iOS and Android back then. There was no good way to build macOS or Windows apps from the same codebase. Snapchat wanted one solution that could power desktop apps too, so they needed something else.

**Limited concurrency**: React Native's JavaScript side was mostly single-threaded. This made it hard to do heavy background work without freezing the UI.

Faced with these limitations, Snapchat decided they needed to build their own framework from scratch. They wanted something that compiled straight to native code and completely avoided the bridge.

### The React Native of today

Modern React Native is completely different. It's been rebuilt to fix these exact problems.

**The bridge is gone**: Current React Native uses the JavaScript Interface (JSI). JSI lets JavaScript and native code talk directly and synchronously. No more serialization overhead from the old bridge.

**Fabric and concurrent rendering**: The new rendering system called Fabric allows concurrent rendering. It can prioritize important UI updates and makes everything more responsive.

**Official desktop support**: Microsoft maintains official React Native versions for Windows and macOS. It's truly cross-platform now.

React Native has solved most of the problems that led to Valdi being created. This makes Valdi's open-source release timing interesting. While compiling directly to native code is still a cool advantage, Valdi is now competing with a much more mature and capable React Native.

## Getting started: The developer experience and its challenges

Valdi is powerful, but setting it up can be tricky compared to something polished like Expo for React Native. This is pretty normal for tools that companies used internally and then open-sourced.

### The setup process

The documentation suggests running `valdi dev_setup` to get started. This script should install everything you need: Homebrew, Bazelisk (manages Bazel versions), Java JDK 17, Android SDK and NDK, and command-line tools like Git LFS and Watchman.

But it doesn't always work smoothly.

![The narrator's notes on fixing the installation, listing issues like "Bazel version mismatch," "Missing development tools," and "Android NDK dependency."](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/a422b5ec-e67c-4647-76e4-da2b9e714000/lg2x =1920x1080)

You should expect to do some manual installation and troubleshooting. Common problems include the setup script missing tools like `watchman`, using the wrong version of Bazel (needs manual fixing), requiring the Android NDK even if you only want to build for iOS, and the build failing if your project name has a hyphen in it because of how native project files get generated.

Once you get everything configured correctly, the workflow is straightforward:

```command
valdi install ios
```

This installs iOS dependencies.

```command
valdi run ios
```

This builds your app and launches it in the iOS simulator.

```command
valdi hotreload
```

This starts the hot reloader so you see changes instantly.

![A split-screen showing the Bazel build logs in the terminal on the left and the successfully launched "Welcome to Valdi" app in the iOS simulator on the right.](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/078fdfa6-e874-45c4-b7f4-346023a18100/public =1920x1080)

## Final thoughts
Valdi is genuinely impressive engineering. It represents eight years of work by a major tech company solving really hard cross-platform problems. **The architecture that compiles straight to native code and uses great tools like Bazel, Yoga, and Skia shows a serious commitment to performance and quality.** The React-like component model makes it accessible to lots of developers.

But releasing it as open source in 2024 is tricky timing. Cross-platform development has matured a lot. React Native fixed its early problems, and it has a huge community, tons of libraries, and polished tools like Expo. **Choosing Valdi for a new project today means betting on a smaller community and an uncertain path.** You'll probably hit setup issues, and there's always a risk that Snapchat could stop supporting it.

Still, open-sourcing Valdi is a gift to developers. It shows an interesting alternative architecture for building cross-platform apps. It's both a useful tool for people who want to try something different and a valuable case study in how software development evolves. **Whether it builds a thriving community remains to be seen, but the technical work alone deserves respect.**