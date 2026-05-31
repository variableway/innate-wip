# Using the TypeScript Compiler (tsc): A Complete Guide

The **TypeScript compiler, accessed through the `tsc` command, transforms your TypeScript code into JavaScript** that browsers and Node.js can execute. Beyond basic compilation, `tsc` offers extensive configuration options that control how your code gets compiled, what errors get caught, and how the output gets structured.

This article explores the TypeScript compiler's command-line interface, showing you how to compile code, configure compilation behavior, and use advanced features that improve your development workflow.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/vcVoyLQMCxU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Prerequisites

Before you begin this guide, you'll need:

- Node.js installed on your system (version 16 or higher recommended). You can download it from the [official Node.js website](https://nodejs.org/).
- Basic familiarity with TypeScript syntax. If you're new to TypeScript, understanding basic types and interfaces will help, but the examples are straightforward enough to follow along.
- A terminal or command prompt for running commands.
- A text editor for writing code (VS Code works well with TypeScript).

The examples in this guide work on macOS, Linux, and Windows.

## Why learn the tsc CLI?

While many developers use build tools like webpack or Vite that handle TypeScript compilation automatically, understanding `tsc` directly gives you several advantages.

Direct control over compilation means you decide exactly how TypeScript compiles your code without build tool abstractions getting in the way. When compilation issues arise, knowing `tsc` helps you diagnose problems quickly instead of fighting with build tool configurations.

Understanding compiler options lets you optimize for your specific needs, whether that's build speed, output size, or strict type checking. The `tsc` command works everywhere without additional dependencies, making it reliable for scripts, CI/CD pipelines, and quick experiments.

Learning `tsc` gives you a solid foundation that applies regardless of which build tools you eventually use in production projects.

## Installing the TypeScript compiler

The TypeScript compiler comes as an npm package that you install as a development dependency in your project. Local installations ensure that each project can use its own TypeScript version, preventing conflicts when different projects require different compiler versions.

First, create a new directory for this tutorial:

```command
mkdir typescript-cli-tutorial
```

Navigate into the directory:

```command
cd typescript-cli-tutorial
```

Initialize a new npm project:

```command
npm init -y
```

This creates a `package.json` file that tracks your project's dependencies. Now install TypeScript as a development dependency:

```command
npm install --save-dev typescript
```

```text
[output]
added 1 package, and audited 2 packages in 2s

found 0 vulnerabilities
```

With a local installation, run the compiler through npx, which executes packages from your `node_modules` directory:

```command
npx tsc --version
```

```text
[output]
Version 5.9.3
```

The output confirms that TypeScript has been installed successfully in your project. The version number may differ depending on when you install it.

## Compiling your first TypeScript file

Create a simple TypeScript file to see how `tsc` works in practice. Create a file called `hello.ts` and open it in your text editor:

```command
touch hello.ts
```

Add the following TypeScript code:

```typescript
[label hello.ts]
function greet(name: string): string {
  return `Hello, ${name}!`;
}

console.log(greet("World"));
```

This simple function takes a string parameter and returns a greeting. The `: string` annotations specify types, which is what makes this TypeScript rather than plain JavaScript.

Compile the file using the simplest possible command:

```command
npx tsc hello.ts
```

The compiler generates `hello.js` in the same directory. Open it to see the compiled output:

```javascript
[label hello.js]
function greet(name) {
    return "Hello, ".concat(name, "!");
}
console.log(greet("World"));
```

Notice how TypeScript removes the type annotations and transforms the template literal into a `concat` call for broader JavaScript compatibility. The type information exists only at compile time to catch errors—it doesn't affect the runtime code.

Run the compiled JavaScript code:

```command
node hello.js
```

```text
[output]
Hello, World!
```

This basic workflow—write TypeScript, compile with `tsc`, run the JavaScript—forms the foundation of TypeScript development.

## Understanding compiler targets

The `--target` option tells TypeScript which JavaScript version to output. Different targets support different language features, affecting how TypeScript transforms your code.

Compile `hello.ts` with an older target to see the difference:

```command
npx tsc hello.ts --target ES5
```

Open the generated `hello.js` file:

```javascript
[label hello.js]
function greet(name) {
    return "Hello, " + name + "!";
}
console.log(greet("World"));
```

ES5 doesn't support template literals, so TypeScript converts them to string concatenation. This ensures your code runs in older browsers that don't understand modern JavaScript syntax.

Try compiling with a modern target:

```command
npx tsc hello.ts --target ES2022
```

```javascript
[label hello.js]
function greet(name) {
    return `Hello, ${name}!`;
}
console.log(greet("World"));
```

ES2022 supports template literals natively, so TypeScript keeps them unchanged. The code is more readable and closer to your original TypeScript.

Choose your target based on where your code runs:

- Use `ES5` for maximum browser compatibility, including Internet Explorer 11
- Use `ES2015` or `ES2016` for modern browsers with some legacy support
- Use `ES2020` or `ES2022` for current browsers and recent Node.js versions
- Use `ESNext` for the latest JavaScript features

The default target is `ES3`, which provides extreme compatibility but produces verbose output. Most projects use `ES2020` or newer unless they need to support older browsers.

## Configuring module systems

JavaScript has several module systems for organizing code, and TypeScript can output any of them. The `--module` option controls which module system gets used in the compiled output.

Create a file with imports and exports to demonstrate module compilation. Create `math.ts`:

```command
touch math.ts
```

Add the following code:

```typescript
[label math.ts]
export function add(a: number, b: number): number {
  return a + b;
}

export function multiply(a: number, b: number): number {
  return a * b;
}
```

Compile with CommonJS modules, which Node.js uses by default:

```command
npx tsc math.ts --module commonjs
```

Open the compiled `math.js`:

```javascript
[label math.js]
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.add = add;
exports.multiply = multiply;
function add(a, b) {
    return a + b;
}
function multiply(a, b) {
    return a * b;
}
```

The output uses `require` and `exports`, which work in Node.js and bundlers that understand CommonJS. The `__esModule` property helps tools recognize that this was originally an ES module.

Compile with ES modules instead:

```command
npx tsc math.ts --module ES2015
```

```javascript
[label math.js]
export function add(a, b) {
    return a + b;
}
export function multiply(a, b) {
    return a * b;
}
```

ES modules use native `import` and `export` statements. This format works in modern browsers and recent Node.js versions with appropriate configuration.

Choose your module system based on your runtime environment:

- Use `CommonJS` for traditional Node.js projects
- Use `ES2015`, `ES2020`, or `ESNext` for modern Node.js with ES modules or browser projects
- Use `AMD` for RequireJS (rarely used today)
- Use `UMD` for libraries that need to work in multiple environments

Most new projects use ES modules, though CommonJS remains common in Node.js applications that haven't migrated to ES modules yet.

## Working with tsconfig.json

Passing compiler options on the command line gets tedious when you have multiple files and complex configurations. TypeScript uses `tsconfig.json` to store compiler settings in a single file that applies to your entire project.

Generate a default configuration file:

```command
npx tsc --init
```

```text
[output]

Created a new tsconfig.json                                                                         
                                                                                                 TS 
You can learn more at https://aka.ms/tsconfig
```

This creates `tsconfig.json` with extensive comments explaining each option. Open the file in your editor. The generated file contains many options, but here are the essential ones:

```json
[label tsconfig.json]
{
  "compilerOptions": {
    "module": "nodenext", "target": "esnext", ...
    "noUncheckedIndexedAccess": true, "exactOptionalPropertyTypes": true, ...
    "strict": true, "jsx": "react-jsx",
    "verbatimModuleSyntax": true, "isolatedModules": true,
    "noUncheckedSideEffectImports": true, "moduleDetection": "force",
    "skipLibCheck": true
  }
}
```

With `tsconfig.json` present, run `tsc` without arguments to compile all TypeScript files in your project:

```command
npx tsc
```

The compiler finds all `.ts` files in your directory, applies the configuration, and generates corresponding `.js` files. This approach scales much better than compiling files individually, especially as your project grows.

If you run `tsc` now, it compiles both `hello.ts` and `math.ts` using the settings from `tsconfig.json`. You can verify this by checking for the generated JavaScript files:

```command
ls *.js
```

```text
[output]
hello.js
math.js
```


## Watching files for changes

During development, recompiling manually after every change becomes tedious and slows you down. The `--watch` flag monitors your files and recompiles automatically when you make changes.

Start the compiler in watch mode:

```command
npx tsc --watch
```

The compiler now watches your TypeScript files for changes. Open `src/hello.ts` and make a modification:

```command
touch src/hello.ts
```

Change the greeting message:

```typescript
[label src/hello.ts]
function greet(name: string): string {
[highlight]  return `Hello there, ${name}!`;[/highlight]
}

console.log(greet("World"));
```

Save the file. The compiler detects the change and recompiles immediately:

```text
[output]
[12:35:02 PM] File change detected. Starting incremental compilation...

[12:35:03 PM] Found 0 errors. Watching for file changes.
```

Watch mode stays active until you stop it with `CTRL+C`. This workflow dramatically speeds up development by eliminating the compile step from your mental checklist. You write code, save the file, and the JavaScript is ready to run.


## Final thoughts

The **TypeScript compiler offers extensive control over how your code gets compiled and checked**. Understanding `tsc` helps you configure compilation precisely for your needs, whether you're building a small script or managing a complex monorepo with multiple projects.

Start with basic compilation and gradually add configuration options as your project grows. The defaults work well for most cases, but knowing the available options lets you optimize for build speed, output compatibility, or type safety based on your specific requirements.

**Experiment with different targets and module systems to understand how they affect your compiled output**. Use strict mode to catch more errors during development, and enable incremental compilation to speed up your build process. These features work together to create a robust development workflow.

For comprehensive information on all compiler options and advanced features, check the [TypeScript compiler options documentation](https://www.typescriptlang.org/tsconfig).