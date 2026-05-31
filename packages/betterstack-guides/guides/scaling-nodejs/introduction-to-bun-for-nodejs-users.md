# Introduction to Bun for Node.js Users

[Bun](https://bun.sh/) is a modern JavaScript runtime built as a drop-in
replacement for Node.js, offering powerful features to enhance the developer
experience. Beyond just running JavaScript, Bun includes an npm-compatible
package manager, first-class TypeScript support, a built-in test runner, and
robust support for Web APIs. One of its standout claims is its exceptional
speed, attributed to its use of the JavaScriptCore engine and optimized system
calls, making it one of the fastest JavaScript runtimes available.

This guide will walk you through Bun's features, giving you the knowledge to
leverage Bun effectively and improve your development workflow.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/m6hlrk2Jwrw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## Prerequisites

To follow this guide, ensure you have:

- The latest version of Bun installed. See the
  [installation instructions](https://bun.sh/docs/installation) for details.
- Familiarity with building applications using JavaScript.

## Understanding Bun

Bun was created to address the complexities and performance limitations of
Node.js, serving as a drop-in replacement. It was written in Zig and built on
[WebKit's JavaScriptCore engine](https://docs.webkit.org/Deep%20Dive/JSC/JavaScriptCore.html)
to enhance its performance.

Key features of Bun include:

- Native support for TypeScript and JSX with automatic transpilation.
- Cross-platform shell scripting via the Bun.$ API.
- Built-in tools for watch mode, reading environment variables, and a test
  runner.
- Implementation of Web-standard APIs like `fetch`, `ReadableStream`, `Request`,
  `Response`, and `WebSocket`.
- Full compatibility with Node.js and npm packages.
- Support for Node.js core APIs, including `fs`, `path`, and `Buffer`.
- Seamless use of both CommonJS and ECMAScript modules (ESM).

With Bun, you can easily use CommonJS and ECMAScript modules without
complexities in Node.js's module resolution process. As a drop-in replacement
for Node.js, you can switch to Bun as your runtime with minimal application
changes. You can integrate specific Bun features, such as its utility functions,
package management, or APIs, into your existing Node.js codebase without fully
migrating. Even if you fully transition to Bun, you'll still have access to
Node.js APIs and npm packages, ensuring a familiar development environment with
a wide range of tools and libraries.

[ad-uptime]

## Getting started with Bun

In this section, you'll begin by initializing the directory with Bun and writing
your first program.

First, verify your installation:

```command
bun --version
```

You should see an output like this:

```text
[output]
1.1.26
```

To initialize a new Bun project:

```command
bun init
```

You'll be prompted with configuration options:

```text
[output]
package name (bun-article): bun-demo
entry point (index.ts): index.js
Done! A package.json file was saved in the current directory.
 + index.js
 + .gitignore
 + jsconfig.json (for editor auto-complete)
 + README.md
To get started, run:
 bun run index.js
```

Bun creates a TypeScript-friendly environment by adding a `jsconfig.json` file
to the directory. It also generates a `package.json` with `"type": "module"`,
enabling ES modules by default and creates a `.gitignore` file to exclude common
files from version control.

Now, create a simple JavaScript file to test Bun:

```javascript
[label index.js]
function welcomeUser(user) {
  return `Hello, ${user.name}!`;
}
console.log(welcomeUser({ name: "Alice" }));
```

Run the script:

```command
bun run index.js
```

The output will be:

```text
Hello, Alice!
```

With that, you've written your first program with Bun. You can now proceed to
the next step is to learn about Bun's tooling.

## Bun tooling

Bun simplifies development by offering a suite of built-in, stable tools that
are ready to use right out of the box. Unlike Node.js, which for many years
required developers to rely heavily on third-party packages for tooling, Bun
provides an integrated experience from the start. The emergence of Bun and Deno
has pushed the JavaScript ecosystem forward, leading Node.js to begin
incorporating some of these built-in tools.

### File watcher

To ensure a smooth development experience, Bun includes built-in options that
eliminate the need to restart the server or download external dependencies like
`nodemon`. Bun provides two modes for reloading your application when it detects
changes:

- `--watch`
- `--hot`

The `--watch` mode automatically restarts your application whenever it detects
changes in your files:

```command
bun --watch index.js
```

The `--hot` mode reloads your code without restarting the entire process,
distinguishing it from Node.js, which only offers a watch mode. This feature is
particularly valuable for applications where maintaining state between changes
is crucial, such as long-running HTTP servers.

```command
bun --hot index.js
```

### Test runner

Bun also has a built-in test runner that supports JavaScript and TypeScript. It
offers features like mocks, hooks, snapshot testing, and UI and DOM testing.

When you use the test runner, it can automatically detect files that match
common naming conventions:

- `\*.test.{js|jsx|ts|tsx}`
- `\*\_test.{js|jsx|ts|tsx}`
- `\*.spec.{js|jsx|ts|tsx}`
- `\*\_spec.{js|jsx|ts|tsx}`

Here’s an example test file:

```javascript
[label index_test.js]
import { expect, test } from "bun:test";

test("addition of two numbers", () => {
  const result = 2 + 2;
  expect(result).toBe(4);
});
```

Run the tests with:

```command
bun test
```

When you run the test, you will see an output similar to this:

```text
[output]
bun test v1.1.26 (0a37423b)

index_test.js:
✓ addition of two numbers [0.66ms]

 1 pass
 0 fail
 1 expect() calls
Ran 1 tests across 1 files. [121.00ms]
```

As you can see, you can test your code without installing additional tools.

### Compile command for creating executables

Bun makes it easy to create standalone executables by compiling your JavaScript
or TypeScript code. The advantage of this feature is that users can run your
application without having to install Bun on their system.

To compile your code into an executable, use the following command:

```command
bun build ./index.js --compile --outfile myindexcli
```

This will bundle the `index.js` into an executable, which you can run directly
like this:

```command
./myindexcli
```

```text
[output]
Hello, Alice!
```

This is much simpler than in Node.js, where you need to follow
[multiple steps](https://nodejs.org/api/single-executable-applications.html) or
rely on a third-party package like [pkg](https://www.npmjs.com/package/pkg).

To target different operating systems, you can read the
[documentation for more details](https://bun.sh/docs/bundler/executables#cross-compile-to-other-platforms).

### Environment variables

Environment variables are essential to projects as they allow you to configure
settings outside your code. With Bun, you don't need to install a dependency to
read [environment variables](https://bun.sh/docs/runtime/env); you can access
them directly.

Assuming you have the following `.env` file:

```text
[label .env]
DATABASE_HOST="localhost"
DATABASE_PORT="3306"
```

You can read the variables with Bun like this:

```javascript
console.log(Bun.env.DATABASE_HOST); // Outputs: "localhost"
console.log(Bun.env.DATABASE_PORT); // Outputs: "3306"
```

## Built-in TypeScript support

Bun offers first-class support for TypeScript, allowing you to write TypeScript
code (`.ts` and `.tsx` files) just like regular JavaScript files without complex
configuration. Bun internally transpiles your TypeScript code into JavaScript
for seamless execution.

For example, consider the following TypeScript program:

```typescript
[label index.ts]
interface User {
  name: string;
}

function welcomeUser(user: User): string {
  return `Hello, ${user.name}!`;
}

console.log(welcomeUser({ name: "Alice" }));
```

You can directly execute your TypeScript file in the terminal using the Bun
command:

```command
bun index.ts
```

This will output:

```text
Hello, Alice!
```

Bun also provides a default `tsconfig.json` when initializing projects with
`bun init`, which is configured with best practices like enabling the `strict`
flag. However, Bun's runtime doesn't perform type checking, as types are removed
during transpilation. You should still use tools like IDEs and `tsc` to check
static type during development.

## Configuring Bun

Bun is highly configurable, allowing you to fine-tune its behaviour across
various aspects of the development process. So far, you've seen how Bun can work
out of the box with common configuration files like `package.json` and
`tsconfig.json`. However, when configuring Bun-specific settings, you use the
[`bunfig.toml` file](https://bun.sh/docs/runtime/bunfig).

The `bunfig.toml` file allows you to customize runtime behaviour, package
management, and even testing configurations. For instance, you can preload
specific scripts or plugins before running your code, define how JSX should be
processed, or enable a low-memory mode for performance-sensitive environments.
Additionally, you can manage logging levels, set up custom file loaders, and
replace global identifiers with constant expressions.

Here’s an example that configures Bun to preload a specific script before
running your code:

```text
[label bunfig.toml]
preload = ["./preload.ts"]
```

With this, Bun will run the `preload.ts` script before executing any other code
with `bun run`.

You can also configure package management to control the installation of
dependencies, decide whether to use exact versioning and specify custom package
registries or caching behaviours.

For example, the following option determines whether Bun should generate a lock
file:

```text
[label bunfig.toml]
[install.lockfile]
save = true
```

Now that you can configure Bun, the next section will explore into how
dependency management works in Bun.

## How dependency management works in Bun

Bun has a built-in package manager fully compatible with Node.js, making it a
seamless replacement for popular tools like npm, yarn, and pnpm. When you run a
command like `bun install`, Bun reads your `package.json` file and handles the
installation of dependencies, `devDependencies`, and `optionalDependencies`. By
default, Bun also installs peer dependencies, distinguishing it from other
package managers.

After resolving dependencies, Bun generates a binary lockfile named `bun.lockb`
in your project root. This lockfile format is optimized for speed, enabling
faster parsing and installation in comparison to traditional JSON- or YAML-based
lockfiles. This focus on performance is also evident when Bun installs packages:
it downloads them into a global cache and checks this cache for future installs,
minimizing unnecessary re-downloading.

For production environments, Bun supports a production mode where it skips the
installation of `devDependencies` and `optionalDependencies`, ensuring that only
the necessary packages are included:

```command
bun install --production
```

Bun's flexibility extends beyond just npm packages. It also lets you install
packages directly from Git, GitHub, or local and remotely-hosted tarballs. For
example, your `package.json` could specify dependencies like this:

```json
[label package.json]
{
  "dependencies": {
    "lodash": "git+ssh://github.com/lodash/lodash.git#4.17.21",
    "moment": "git@github.com:moment/moment.git"
 }
}
```

You can customize the behaviour of `bun install` through the `bunfig.toml`
configuration file. This file allows you to fine-tune aspects like whether to
install optional, dev, or peer dependencies:

```text
[label bunfig.toml]
[install]
# whether to install optionalDependencies
optional = true

# whether to install devDependencies
dev = true

# whether to install peerDependencies
peer = true
```

This configuration gives you control over your dependency management process,
ensuring that Bun meets the specific needs of your project.

## Standard library

Bun offers a comprehensive standard library accessible directly through the
`Bun` global object, so importing individual modules is unnecessary. This
differs from Node.js, where you typically import specific modules to interact
with files, manage child processes, or handle other tasks. Bun also emphasizes
compatibility with standard Web APIs, ensuring ease of use and integration.
Where no standard APIs exist, Bun introduces its own optimized solutions.

Bun provides a variety of powerful APIs, including:

- [HTTP Server](https://bun.sh/docs/api/http#bun-serve): `Bun.serve()` allows
  you to start an HTTP server with minimal configuration easily.
- [File I/O](https://bun.sh/docs/api/file-io#reading-files-bun-file):
  `Bun.file()` and `Bun.write()` offer methods for reading from and writing to
  the file system.
- [Child Processes](https://bun.sh/docs/api/spawn#spawn-a-process-bun-spawn):
  `Bun.spawn()` and `Bun.spawnSync()` provide straightforward ways to manage
  child processes.
- [TCP and UDP Sockets](https://bun.sh/docs/api/tcp#start-a-server-bun-listen):
  `Bun.listen()` and `Bun.connect()` enable low-level network communication.
- [HTML Streaming Transformations](https://bun.sh/docs/api/html-rewriter):
  `HTMLRewriter` provides tools for modifying and rewriting HTML content on the
  fly.
- [Hashing and Cryptography](https://bun.sh/docs/api/hashing#bun-hash):
  `Bun.hash()` and `Bun.CryptoHasher()` offer fast, secure methods for
  generating hashes and performing other cryptographic operations.
- [Utilities](https://bun.sh/docs/api/utils#bun-version): Bun provides a wide
  array of utility functions, such as `Bun.version()`, `Bun.env()`, and
  `Bun.deepEquals()`, to assist with everyday tasks like version management,
  environment variable access, and deep comparison of objects.

You can refer to the
[official documentation](https://bun.sh/docs/runtime/bun-apis) for a complete
list of Bun APIs.

For instance, the code below demonstrates using Bun’s standard library to create
an HTTP server:

```javascript
[label index.js]
Bun.serve({
  fetch(req) {
    const url = new URL(req.url);
    if (url.pathname === "/") return new Response("Hello World!");
 return new Response("404!");
 },
});
```

This code sets up a basic HTTP server with Bun that responds with "Hello World!"
when the root URL `/` is accessed and "404!" for any other path.

You can run the program with the following command:

```command
bun run index.js
```

The server will continue running, and in another terminal, you can test the root
endpoint with `curl`:

```command
curl http://localhost:3000/
```

The output should be similar to this:

```text
[output]
Hello World!
```

Now that you have an idea of how to use Bun's standard library, you'll explore
the Web Platform APIs it supports next.

## Web platform APIs

Similar to Node.js, Bun focuses on implementing Web Platform APIs that are most
relevant to a server-first runtime, intentionally omitting APIs like the DOM or
History API that aren't applicable in a server environment. This makes it easier
to transition to Bun if you're already familiar with frontend development or
other JavaScript runtimes.

Bun supports key web APIs such as the
[Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/fetch),
[Streams API](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API),
[Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API),
[Web Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Worker), and
[WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket). For
more details on the supported APIs, you can refer to the official
[Bun documentation](https://bun.sh/docs/runtime/web-apis).

Here’s a simple example demonstrating how to use the Fetch API in Bun:

```javascript
[label index.js]
const response = await fetch("https://jsonplaceholder.typicode.com/todos/1");
const data = await response.json();
console.log("Fetched data:", data);
```

When you run the program, you’ll see the output showing that you can fetch and
parse data using the Fetch API:

```command
bun run index.js
```

```text
[output]
Fetched data: { userId: 1, id: 1, title: "delectus aut autem", completed: false }
```

Now that you know how Bun integrates with web platform APIs, the next section
will explore its compatibility with Node.js.

## Node.js Compatibility

As mentioned earlier, Bun is designed as a drop-in replacement for Node.js. This
approach enables most npm packages built for Node.js to be used with Bun
seamlessly. Bun also relies on the standard `package.json` file, just like
Node.js, allowing developers to manage dependencies and scripts in a familiar
way. Furthermore, Bun natively supports the CommonJS syntax.

Bun strives to fully support a wide range of Node.js APIs, making it easier for
developers to transition from Node.js without needing to rewrite their
applications. This compatibility extends to most of the core modules that
Node.js developers rely on, ensuring that existing projects run smoothly on Bun.

Here are some of the [Node.js APIs](https://bun.sh/docs/runtime/nodejs-apis)
that are fully implemented in Bun:

- [`node:assert`](https://nodejs.org/api/assert.html)
- [`node:buffer`](https://nodejs.org/api/buffer.html)
- [`node:console`](https://nodejs.org/api/console.html)
- [`node:dns`](https://nodejs.org/api/dns.html)
- [`node:path`](https://nodejs.org/api/path.html)
- [`node:querystring`](https://nodejs.org/api/querystring.html)
- [`node:url`](https://nodejs.org/api/url.html)

Here is an example:

```javascript
[label index.js]
import assert from "node:assert";

function add(a, b) {
 return a + b;
}

assert.strictEqual(
 add(2, 3),
 5,
 "The add function should return the sum of two numbers"
);
console.log("All tests passed!");
```

In this example, the [`assert`](https://nodejs.org/api/assert.html) module
verifies that the `add` function works correctly. The script checks if the
function correctly adds two numbers and will throw an error if it doesn't.

When you run this code with Bun, it behaves just as it would in Node.js,
demonstrating Bun's compatibility with Node.js APIs.

This strong compatibility ensures you can continue using your favourite Node.js
modules and packages while benefiting from Bun's performance enhancements and
additional features.

## Performance

Bun is designed with a strong emphasis on speed, making it one of the fastest
JavaScript runtimes available. Its performance edge comes from several factors:

Bun extends the JavaScriptCore engine, which is renowned for its quick startup
times and efficient execution. Built using Zig, a language offering low-level
control and high performance, Bun operates exceptionally efficiently.

Additionally, Bun's package management system is optimized for speed. It
features a global install cache, which means that once a package is downloaded,
it doesn't need to be re-downloaded, significantly reducing installation times.

Recent benchmarks showcase Bun's impressive performance:

| Framework | Mean     | Stddev  | Max      | Relative |
| --------- | -------- | ------- | -------- | -------- |
| **Bun**   | 80211.92 | 8737.07 | 97810.01 | 100%     |
| **Node**  | 17155.19 | 1487.27 | 21912.30 | 21%      |

These benchmarks clearly illustrate Bun's speed advantage over Node.js. However,
it's important to view them in context. Benchmarks typically focus on specific
scenarios, and real-world performance can vary depending on the application and
environment.

## Should you use Bun?

Deciding whether to adopt Bun requires a thoughtful assessment of your project's
specific needs and goals. While Bun offers appealing features like native
TypeScript support, an integrated test runner, watch mode, and built-in database
capabilities, it's essential to recognize that Node.js has also been evolving to
incorporate similar features. Many of these capabilities are now available in
stable Node.js releases or as experimental options, which may reduce the
incentive to switch if you're already comfortable with the Node.js ecosystem.

It's also important to note that Bun is not fully compatible with Node.js, which
can lead to migration challenges. For example, frameworks like
[Next.js App Router rely](https://bun.sh/guides/ecosystem/nextjs) on Node.js
APIs that Bun has not yet implemented. If performance is your primary motivation
for considering Bun, be cautious with benchmarks, as they often focus on simple
scenarios that might not accurately represent the complexities of real-world
applications.

Bun can be an excellent choice for new projects. Starting fresh with Bun allows
you to take full advantage of its strengths while avoiding potential
compatibility issues during migration. Ultimately, the decision to use Bun
should be based on a comprehensive evaluation of your project's requirements,
your team's expertise, and the potential benefits and challenges of adopting a
newer runtime.

## Final thoughts

In this article, you've explored Bun's key features and performance benefits.
You've learned how Bun's design as a drop-in replacement for Node.js allows for
seamless compatibility with npm packages. Additionally, you've seen how Bun's
built-in TypeScript supports an optimized package management system, tooling and
robust standard library.

To further deepen your understanding and fully leverage what Bun offers, explore
the [official documentation](https://bun.sh/) and continue experimenting with
Bun in your projects
