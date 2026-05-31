# Exploring Deno: Is It Time to Ditch Node.js?

For years, Node.js dominated as the go-to runtime for executing JavaScript
outside the browser. But in 2020, the introduction of Deno disrupted this
landscape, offering a fresh alternative that directly addresses Node.js's
shortcomings.

Deno comes with native TypeScript support, a secure permissions-based sandbox,
and an integrated toolkit that includes a code formatter, linter, test runner,
and build tool for self-contained executables.

Its innovative approach to dependency management eliminates the need for
`package.json` and `node_modules`, yet it retains full compatibility with the
Node.js ecosystem to allow you choose the approach that works best for you.

This guide explores Deno's features and compares them with Node.js to help you
decide if switching is right for you.

Let's get started!

<iframe width="100%" height="315" src="https://www.youtube.com/embed/m6hlrk2Jwrw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## Prerequisites

If you want to experiment with the features described in this article, refer to
the
[Deno installation instructions](https://docs.deno.com/runtime/manual/getting_started/installation/).

You can verify your installation with:

```command
deno --version
```

This should produce an output similar to:

```text
[output]
deno 2.0.0 (stable, release, x86_64-unknown-linux-gnu)
v8 12.9.202.13-rusty
typescript 5.6.2
```

## Understanding Deno

Deno is a modern alternative to Node.js, a widely-used runtime for building
server-side applications. Both were created by Ryan Dahl, who developed Deno to
address limitations he identified in Node.js.

In a [2018 presentation](https://www.youtube.com/watch?v=M3BM9TB-8yA), Dahl
outlined these shortcomings, including:

- The absence of a unified approach to asynchronous programming with Promises,
- Missed opportunities to enhance security,
- The complexities of the build system (GYP),
- And challenges tied to the module system, such as reliance on `package.json`,
  `node_modules`, and implicit file extensions.

Deno tackles these issues by offering a secure, modern, and streamlined runtime.
It enforces security through an explicit permissions model for file system and
network access, simplifying the module system by adopting URL-based imports with
required file extensions.

Native TypeScript support is built-in to eliminate the need for additional tools
or configurations. Deno also adheres to web standards, facilitates the creation
of standalone executables, and is built on V8 and Rust for performance and
reliability.

In [Deno 2](https://deno.com/blog/v2.0), compatibility with the Node.js
ecosystem was significantly enhanced, making it a compelling choice for
developers seeking a more secure and modern development experience without
sacrificing access to existing tools and libraries.

To better understand its potential and how it stacks up against Node.js, we'll
dive deeper into Deno's key features and compare them with those of its
predecessor.

[ad-uptime]

## A modern approach to tooling

Deno provides a comprehensive suite of built-in tools, eliminating the need for
third-party dependencies often required in other runtimes like Node.js. This
seamless integration simplifies development, minimizes dependency management,
aligns Deno with the integrated approach to tooling found in modern languages
like Go and Rust.

![Diagram illustrating Deno's tooling ecosystem](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/e526cdd3-062f-44be-9f7c-7e7417387200/md1x
=1301x622)

Let's look at each of these in turn:

### REPL (Read-Eval-Print Loop)

Deno includes a robust REPL for quick experimentation. Unlike Node.js' REPL,
Deno's counterpart supports TypeScript natively, allowing you to write and test
TypeScript code directly without prior compilation:

```text
Deno 2.0.6
exit using ctrl+d, ctrl+c, or close()
REPL is running with all permissions allowed.
To specify permissions, run `deno repl` with allow flags.
[highlight]
> console.log(((name: string) => `Hello, ${name}!`)("Alice"));
[/highlight]
Hello, Alice!
undefined
>
```

### File watcher

![Screenshot of Deno's file watcher](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/2d106cfc-d1c6-4e8f-84c3-9f6d025ecd00/lg2x =2060x778)

Deno's file watcher automatically restarts your application when it detects
changes in your code.

```command
deno run --watch app.js
```

```text
[output]
Watcher Process started.
HTTP server running. Access it at: http://localhost:8080/
Listening on http://0.0.0.0:4000/
```

It also supports Hot Module Replacement (HMR) which enables application updates
without a without a complete restart:

```command
deno run --watch-hmr app.js
```

Node.js introduced a watch feature of its own in v18.11.0 which works in a
similar manner, but it currently lacks hot module replacement functionality.

### Linter and formatter

One of the features that sets Deno apart from Node.js is its built-in
[linter](https://docs.deno.com/runtime/manual/tools/linter/) and
[formatter](https://docs.deno.com/runtime/manual/tools/formatter/) which makes
it possible to enforce code quality standards without resorting to third-party
dependencies.

You can access them with the following commands:

```command
deno lint
```

```command
deno fmt
```

Node.js doesn't offer a built-in linter or formatter, so you'll need to use a
tool like ESLint, Prettier, or BiomeJS.

### Test runner

Writing tests for existing code is one of the most common tasks in software
development, and Deno simplifies this process with its built-in test runner:

```javascript
[label app_test.js]
import { assertEquals } from "https://deno.land/std@0.196.0/testing/asserts.ts";

function add(a, b) {
  return a + b;
}

Deno.test("Add two numbers", () => {
  const result = add(2, 2);
  assertEquals(result, 4);
});
```

You can run tests with:

```command
deno test
```

![Screenshot of test output](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/b1644133-22d5-44f7-3f2b-f21c0439fd00/public
=1684x796)

In Deno 2, you can run test code examples directly within JSDoc comments or
Markdown files using the `--doc` option which is useful for ensuring that your
documentation's code snippets stay accurate and up to date.

```javascript
[label app.js]
/**
 * Adds two numbers together.
 *
 * # Examples
 *
 * ```js
 * const sum = add(1, 2);
 * console.assert(sum === 3, 'Expected 3, but got ' + sum);
 * ```
 *
 * @param {number} a - The first number to add.
 * @param {number} b - The second number to add.
 * @returns {number} The sum of the two numbers.
 */
export function add(a, b) {
  return a + b;
}
```

You can now test the code examples directly from the documentation with:

```command
deno test --doc app.js
```

### Compile command for creating executables

Deno simplifies the process of creating standalone executables from your
TypeScript or JavaScript code. Unlike Node.js, which requires a more intricate
approach to
[building single executable applications](https://nodejs.org/api/single-executable-applications.html),
Deno enables you to generate an executable with a single command:

```command
deno compile app.js
```

```text
[output]
Check file:///home/dev/betterstack/demo/prometheus-metrics/app.js
Compile file:///home/dev/betterstack/demo/prometheus-metrics/app.js to app
```

You can then run the compiled binary like any other executable:

```command
./app
```

---

Deno's ecosystem is further enhanced with tools such as:

- `deno bench`: For creating and running benchmarks to measure and optimize code
  performance.
- `deno jupyter`: A Deno kernel for Jupyter notebooks, enabling interactive
  TypeScript development in a notebook environment.

These integrated tools make Deno a comprehensive and efficient platform for
JavaScript and TypeScript development, minimizing the need for external
dependencies.

## Permissions in Deno

One of Deno's most notable features is its secure-by-default approach. Unlike
Node.js, where programs can access networks, file systems, and other sensitive
resources without restrictions, Deno prevents access to these resources by
default. To perform actions like network requests, you must explicitly grant
permission, which significantly enhances the security of your applications.

![Screenshot of the Deno Runtime](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/1ad6c3f4-a12c-48f0-ee9f-5e3a46d30f00/md2x
=5732x2759)

For example, consider the following code that fetches a to-do item from an API:

```javascript
[label app.js]
async function fetchTodo(id) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${id}`
  );
  if (!response.ok) {
    throw new Error(`API request failed with status: ${response.status}`);
  }
  return await response.json();
}

fetchTodo(1).then((todo) => {
  console.log("Fetched To-Do Item:", todo);
});
```

When you run this program, Deno detects that it requires network access:

```text
[output]
┌ ⚠️  Deno requests net access to "jsonplaceholder.typicode.com:443".
├ Requested by `fetch()` API.
├ Run again with --allow-net to bypass this prompt.
└ Allow? [y/n/A] (y = yes, allow; n = no, deny; A = allow all net permissions) >
```

If you deny the request by entering `n`, the program will fail with a
`PermissionDenied` error, indicating that network access was blocked. To allow
network access, you can rerun the program with the `--allow-net` flag:

```command
deno run --allow-net app.js
```

This will enable the program to fetch the data successfully:

```text
[output]
Fetched To-Do Item: { userId: 1, id: 1, title: "delectus aut autem", completed: false }
```

For more granular control, you can restrict network access to specific domains
or IP addresses:

```command
deno run --allow-net='jsonplaceholder.typicode.com' app.js
```

This security model not only improves the safety of your applications but also
allows for more precise permission management. Beyond network access, Deno
offers other permissions, such as:

- **--allow-read**: Grants read access to the file system.
- **--allow-write**: Grants write access to the file system.
- **--allow-env**: Grants access to environment variables.
- **--allow-run**: Allows spawning subprocesses.
- **--allow-ffi**: Allows loading dynamic libraries (Foreign Function
  Interface).

These options ensure that your Deno applications operate securely while having
the necessary access to resources.

## Configuring Deno

Deno offers a flexible configuration system that lets you customize various
aspects of the runtime environment, including the TypeScript compiler,
formatter, linter, and more. While not required for execution, a configuration
file allows you to tailor Deno's behavior to suit your project's specific needs.

As mentioned earlier, Deno supports configuration files with `.json` and
`.jsonc` extensions. Since version 1.18, Deno automatically detects these files
in your working or parent directories.

Here's an example of a typical `deno.json` configuration file:

```json
[label deno.json]
{
  "imports": {
    "std/assert": "jsr:@std/assert@^1.0.0"
  },
  "tasks": {
    "dev": "deno run --watch app.ts"
  }
}
```

This configuration highlights two key features: the `imports` and `tasks`
fields. The `imports` field, functioning as an import map, lets you create
aliases for modules, simplifying module management. The `tasks` field, similar
to the `scripts` field in Node.js's `package.json`, defines custom scripts that
can be run with the `deno task` command, enabling automation of tasks like
starting a server or running tests directly within the Deno runtime.

To run a task defined in the configuration, you use:

```command
deno task dev
```

In this case, the `dev` task would start your application in watch mode,
automatically reloading the server on file changes.

Beyond these basics, the configuration file offers other options that further
enhance your control over Deno's behavior:

- `compilerOptions`: Customize TypeScript compiler settings to match your
  project's needs, such as enabling strict type checking or targeting specific
  JavaScript versions.
- `lint`: Configure Deno's built-in linter, allowing you to enforce coding
  standards and best practices across your codebase.
- `fmt`: Set up the code formatter to ensure consistent styling, making your
  code easier to read and maintain.
- `test`: Define how tests are run, including options for test filtering and
  setup configurations, to streamline your testing process.

## First-class TypeScript support

![Screenshot of the Deno execution workflow](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/63c3365d-b446-4d78-11b3-296cb1325000/orig
=6033x2376)

Deno offers first-class support for TypeScript with zero configuration, allowing
you to write type-safe programs without complex build systems.

The compiled JavaScript is subsequently cached, so that it doesn't need to be
recompiled for subsequent executions.

For example:

```typescript
[label app.ts]
interface User {
  name: string;
}

function welcomeUser(user: User): string {
  return `Hello, ${user.name}!`;
}

console.log(welcomeUser({ name: "Alice" }));
```

You can run this TypeScript file as easily as a JavaScript file:

```command
deno run app.ts
```

This will output:

```text
[output]
Hello, Alice!
```

Here, no separate compilation step is necessary. The caching mechanism ensures
that your TypeScript code is only compiled once, which speeds up repeated
executions.

If you're curious about the details, including the cache structure, you can
inspect this using the `deno info` command, which reveals where Deno stores the
transformed JavaScript and related metadata.

## Dependency management in Deno

Deno introduces a unique approach to dependency management by adopting a
web-centric model emphasizing simplicity, security, and adherence to standards.

Instead of using traditional package managers like npm or Yarn, Deno employs a
URL-based import system. This is similar to how web browsers handle module
imports, offering several benefits:

- Transparency, where developers can easily trace the source of each dependency,
- Versioning, by pinning specific versions directly in the import URL,
- Decentralization, by allowing modules to be hosted anywhere, not just on a
  central registry.

For example:

```typescript
import { serve } from "https://deno.land/std@0.196.0/http/server.ts";
serve((req) => new Response("Hello Deno!"), { port: 8000 });
```

When a module is downloaded for the first time, it is cached locally, speeding
up subsequent runs. Integrity checks ensure that cached modules haven't been
tampered with, and versioning in URLs allows for reproducible builds and easy
updates.

Deno fully embraces ES modules to align with modern JavaScript standards. This
decision brings several benefits, such as:

- Compatibility with browser JavaScript.
- Better tree-shaking and static analysis capabilities.
- A clearer code structure with explicit imports and exports.

As Deno projects scale, managing dependencies across multiple files can lead to
version conflicts, inconsistencies, and slower performance due to repeated
module fetches. To address this, Deno uses the `deps.ts` pattern to centralize
dependencies in a single file:

```typescript
// deps.ts
export { serve } from "https://deno.land/std@0.196.0/http/server.ts";

// main.ts
import { serve } from "./deps.ts";
```

Deno also provides vendoring capabilities to allow you to download and store all
project dependencies locally. You can enable vendoring in your `deno.json` file
with the following configuration:

```json
[label deno.json]
{
  "vendor": true
}
```

After vendoring, you can run your application offline by using the
`--cached-only` flag:

```command
deno run --cached-only app.ts
```

## The Deno standard library

The Deno standard library is a curated collection of high-quality modules
hosted on JSR and maintained by the Deno core team to
ensure reliability and compatibility.

Each module in the library is independently versioned, allowing for isolated
updates without affecting the entire library. The library also emphasizes
cross-platform compatibility to ensure consistent functionality across different
operating systems.

![Screenshot of Deno runtime library](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/e126e386-af2f-4739-4538-96c76f76dc00/lg1x
=5185x3202)

Some useful standard library modules include:

- `@std/fs`: Utilities for interacting with the file
  system, making file operations straightforward.
- `@std/http`: Tools for building and handling HTTP
  servers and requests, essential for web development.
- `@std/json`: Efficient parsing and serialization
  of JSON data, including streaming operations.
- `@std/log`: A versatile logging framework for
  customizable and structured logging.
- `@std/path`: Utilities for working with file and
  directory paths, ensuring cross-platform compatibility.
- `@std/streams`: Utilities for working with web
  streams.

For example, to use the logging module from the standard library:

```javascript
[label app.js]
import * as log from "@std/log";

log.debug("Debugging the application initialization.");
log.info("User ID 123456 logged in.");
log.critical("Critical failure: 500 Internal Server Error.");
```

Before using a standard library module, you must add the package:

```command
deno add @std/log
```

## Deno's compatibility with web platform APIs

Deno prioritizes implementing Web Platform APIs over proprietary features. This
fosters a more unified and interoperable ecosystem, reducing fragmentation and
promoting code reusability across JavaScript runtimes.

The following are some of the critical Web APIs supported by Deno. You can find
the complete list in the
[official documentation](https://docs.deno.com/runtime/manual/runtime/web_platform_apis/):

- [Fetch API](https://docs.deno.com/runtime/manual/runtime/web_platform_apis/#fetch-api)
- [Location API](https://docs.deno.com/runtime/manual/runtime/location_api/)
- [Streams API](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [Web File API](https://developer.mozilla.org/en-US/docs/Web/API/File_API)
- [Web Storage API](https://docs.deno.com/runtime/manual/runtime/web_storage_api/)
- [Web Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Worker)
- [`WebSocket`](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)

Here's a simple example demonstrating how to use the Web Storage API in Deno:

```javascript
[label app.js]
// Store a value in localStorage
localStorage.setItem("username", "denoUser");

// Retrieve the value from localStorage
const username = localStorage.getItem("username");
console.log("Stored username:", username);

// Remove the value from localStorage
localStorage.removeItem("username");

// Verify removal
const removedUsername = localStorage.getItem("username");
console.log("Removed username:", removedUsername);
```

This demonstrates the basics of using `localStorage` in Deno. Unlike in
browsers, Deno's local storage is an in-memory implementation that doesn't
persist between program runs.

## Deno's compatibility with Node.js

Deno initially didn't plan to support npm or Node.js modules, but in recent
years, they've softened their stance (perhaps due to low adoption rates and
strong competition from Bun) by introducing native support for running npm
modules.

This decision significantly expands Deno's ecosystem and simplifies the
transition for developers coming from Node.js. This means you can now easily
migrate your Node.js to Deno enjoying Deno's security and modern tooling with
minimal effort.

Here's some of the Deno features that allow you to run existing Node
applications:

- Native support for `package.json`, `node_modules`, and npm workspaces.
- Native support for built-in Node.js modules like `buffer`, `fs`,
  `worker_threads`, `process`, and others.

```javascript
import os from "node:os";
```

- Package management with `deno install`, `deno add`, and `deno` remove
  commands.
- Minor syntax adjustments needed to get your code working can be applied with
  `deno lint --fix`.
- You can use npm packages without `package.json` and `node_modules` with the
  `npm:` specifier:

```javascript
import express from "npm:express@4";
```

Or use `deno.json`:

```json
// deno.json
{
  "imports": {
    "chalk": "npm:express@4"
  }
}
```

```javascript
import express from "express";
```

- Support for popular Node.js frameworks like Next.js, Astro, Remix, Angular,
  SvelteKit, QwikCity, and others.
- Deno can execute CommonJS files while still enforcing its permission model:

```command
deno run index.cjs
```

## Deno vs Node.js performance

According to these [benchmarks](https://github.com/denosaurs/bench), Deno
demonstrates a significant performance advantage over Node.js, as shown in the
benchmark results:

![Screenshot of the framework performance](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/9bee7360-bcc5-44ab-b390-2d759d70fc00/orig
=1979x1180)

| Framework        | Mean RPS  | Max RPS   | Relative Performance |
| ---------------- | --------- | --------- | -------------------- |
| Deno (native)    | 68,851.87 | 90,944.36 | 87%                  |
| Node.js (native) | 16,818.01 | 22,887.07 | 21%                  |
| Express (Deno)   | 11,116.47 | 13,183.14 | 14%                  |
| Express (Node)   | 6,329.47  | 7,907.90  | 8%                   |

While these results highlight Deno's capabilities compared to Node.js,
real-world performance can be influenced by various factors so ensure to run
your own benchmarks.

## Should you switch to Deno?

You've explored Deno, and now the question lingers: is it time to make the
switch from Node.js?

The answer depends on your priorities. If you value modern standards, security,
and a streamlined toolchain, with better performance to boot, Deno is a
compelling choice, especially for new projects or when starting from scratch.

With the release of Deno 2, compatibility with Node.js has significantly
improved, making migration or integration with existing Node.js projects easier
than ever.

That said, Node.js remains a dominant force in JavaScript development, and its
ecosystem is continuously evolving. Recent updates have introduced:

- A built-in test runner.
- An experimental permissions system, to address some security concerns.
- Native TypeScript support (though not as seamless as Deno's).
- Watch mode for better development workflow.
- Native support for Web APIs like Fetch, WebSocket API, Web Streams, and more.

This means that many of the benefits that Deno offers are slowly becoming
available in Node.js.

Ultimately, the choice between Deno and Node.js depends on your project's needs
and your willingness to adopt newer technologies.

Whether you switch fully or experiment with Deno alongside Node.js, the growing
competition between these platforms is great news for JavaScript developers
everywhere.

To learn more about Deno, be sure to check out
[the documentation](https://docs.deno.com/) for further information.