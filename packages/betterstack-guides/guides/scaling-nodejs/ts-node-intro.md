# Getting Started with ts-node

[ts-node](https://github.com/TypeStrong/ts-node) is a fantastic tool that makes running TypeScript in Node.js a breeze! You can use it directly without needing to compile first, which saves you time and effort. 

Its flexibility goes way beyond just running scripts; it's also great for working smoothly with popular development tools like testing frameworks, build systems, and development servers. 

This friendly guide will gently lead you through setting up ts-node, exploring its many customization options, and sharing best practices to help you create strong, reliable TypeScript applications with confidence.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/u_GQSEjis48" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>


## Prerequisites

Before using ts-node, make sure you have a recent version of [Node.js](https://nodejs.org/en/download/) (version 14 or above) and `npm` installed on your development machine. This guide assumes you are familiar with [TypeScript fundamentals](https://www.typescriptlang.org/docs/) and basic Node.js development concepts.


## Setting up your first ts-node project

To demonstrate ts-node's capabilities effectively, we'll create a new TypeScript project from scratch. Start by setting up a new project directory and initializing it with npm:

```command
mkdir ts-node-guide && cd ts-node-guide
```

```command
npm init -y
```

Next, install TypeScript and ts-node as development dependencies. We'll also install the Node.js type definitions to enable proper TypeScript intellisense for Node.js APIs:

```command
npm install --save-dev typescript ts-node @types/node
```

Create a TypeScript configuration file (`tsconfig.json`) in your project root with the following:

```command
npx tsc --init
```
Create a `src` directory and add your first TypeScript file:

```command
mkdir src
```

```typescript
[label src/index.ts]
interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

function createUser(name: string, email: string): User {
  return {
    id: Math.floor(Math.random() * 1000),
    name,
    email,
    createdAt: new Date()
  };
}

const user = createUser('Alice Johnson', 'alice@example.com');
console.log('Created user:', user);
```

Now execute your TypeScript code directly using ts-node:

```command
npx ts-node src/index.ts
```

You should see output similar to:

```text
[output]
Created user: {
  id: 271,
  name: 'Alice Johnson',
  email: 'alice@example.com',
  createdAt: 2025-08-06T11:07:05.165Z
}
```

![Screenshot of the terminal output](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/ed522132-e9a1-4dbd-ba4f-901a70639100/public =1236x1136)

The remarkable aspect of this workflow is that ts-node compiles and executes your TypeScript code in a single step, complete with full type checking and modern JavaScript feature support.

## Understanding ts-node execution modes

ts-node offers several execution modes to accommodate different development scenarios and performance requirements. Understanding these modes is crucial for optimizing your development workflow.

### Standard compilation mode

The default mode performs full TypeScript compilation with complete type checking on every execution. While this provides maximum type safety, it can be slower for large codebases:

```command
npx ts-node src/index.ts
```

### Transpile-only mode

For faster execution during development, you can skip type checking and only perform transpilation:

```command
npx ts-node --transpile-only src/index.ts
```

This mode significantly reduces startup time but sacrifices compile-time type checking. It's particularly useful when you're using a separate type-checking process (like your editor's TypeScript service) or when running tests that don't require immediate type validation.

### REPL mode

ts-node includes a TypeScript REPL (Read-Eval-Print Loop) that's perfect for experimenting with TypeScript code:

```command
npx ts-node
```

```typescript
> interface Product { name: string; price: number }
undefined
> const laptop: Product = { name: 'MacBook Pro', price: 2499 }
undefined
> laptop.price * 0.9
2249.1
```

The REPL maintains full TypeScript type checking and autocomplete support, making it an excellent tool for rapid prototyping and learning TypeScript concepts.


### The ES module challenge with ts-node

You might think that simply adding `"type": "module"` to your `package.json` would seamlessly enable ES module support. Let's test this assumption by attempting to configure our working project for ES modules.

First, configure your project as an ES module using npm:

```command
npm pkg set type=module
```

Next, update your `tsconfig.json` with a modern ES module configuration:

```json
{
  "compilerOptions": {
    "module": "nodenext",
    "target": "esnext",
    "types": ["node"],
    "lib": ["esnext"],
    "sourceMap": true,
    "declaration": true,
    "declarationMap": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "strict": true,
    "jsx": "react-jsx",
    "verbatimModuleSyntax": true,
    "isolatedModules": true,
    "noUncheckedSideEffectImports": true,
    "moduleDetection": "force",
    "skipLibCheck": true
  },
[highlight]
  "ts-node": {
    "esm": true
  }
[/highlight]
}
```

Now try running your existing code with the ESM loader:

```command
npx ts-node --esm src/index.ts
```

You'll likely encounter the "Unknown file extension .ts" error, demonstrating that even with modern TypeScript configurations like `"module": "nodenext"` and strict module settings, ES module adoption with ts-node requires additional considerations and often behaves inconsistently across different Node.js versions.

```text
[output]
(node:91709) [DEP0180] DeprecationWarning: fs.Stats constructor is deprecated.
(Use `node --trace-deprecation ...` to show where the warning was created)
TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /Users/stanley/ts-node-guide/src/index.ts
    at Object.getFileProtocolModuleFormat [as file:] (node:internal/modules/esm/get_format:219:9)
    at defaultGetFormat (node:internal/modules/esm/get_format:245:36)
    at defaultLoad (node:internal/modules/esm/load:120:22)
    at async nextLoad (node:internal/modules/esm/hooks:748:22)
    at async nextLoad (node:internal/modules/esm/hooks:748:22)
    at async Hooks.load (node:internal/modules/esm/hooks:385:20)
    at async MessagePort.handleMessage (node:internal/modules/esm/worker:199:18) {
  code: 'ERR_UNKNOWN_FILE_EXTENSION'
}
```

### The pragmatic solution: Use tsx instead

Rather than wrestling with ts-node's ES module complications, there's a better approach. Install `tsx`, a modern TypeScript executor that handles ES modules seamlessly:

```command
npm install --save-dev tsx
```

Now run your TypeScript code with tsx:

```command
npx tsx src/index.ts
```

It works immediately without configuration headaches. tsx is faster, more reliable with modern Node.js versions, and eliminates the ES module compatibility issues that plague ts-node.

For modern TypeScript development with ES modules, tsx is simply the better choice—save yourself the debugging time and use the tool that works.

## When to use ts-node: Understanding its place in modern TypeScript development

While ts-node has been a valuable tool in the TypeScript ecosystem, it's important to understand its current limitations and consider when alternative solutions might serve you better.

ts-node faces several challenges that make it less suitable for modern TypeScript projects:

* **ES module problems**: As shown earlier, ts-node's support for ES modules is inconsistent and varies across Node.js versions, which can be frustrating for current codebases.

* **Performance issues**: ts-node's compilation process can cause significant startup delays, especially in large projects or when running tests often.

* **Configuration difficulty**: Achieving the best ts-node setup often requires a lot of troubleshooting and environment-specific adjustments.

### The modern alternative: tsx

For new TypeScript projects, tsx offers a better experience with seamless ES module support, faster performance, and easier setup that works right away.

```command
npm install --save-dev tsx
```

### Native TypeScript support: The future direction

The TypeScript ecosystem is moving toward native execution support, reducing the need for third-party tools entirely.

**Node.js experimental TypeScript support**: Recent Node.js versions include experimental flags for running TypeScript directly:

```command
node --experimental-strip-types src/index.ts
```

This feature strips TypeScript syntax without type checking, enabling direct execution. For more details, see the [Node.js TypeScript documentation](https://nodejs.org/api/typescript.html).

**Alternative runtimes**: Deno and Bun both feature built-in TypeScript support that is fast and reliable, showing how modern JavaScript runtimes can run TypeScript natively.

## Final thoughts and next steps

ts-node was vital for early TypeScript adoption, allowing direct execution without compilation.

Now, modern tools like tsx offer better performance, easier setup, and reliable ES module support. For new projects, tsx is the practical choice during development.

As native TypeScript support matures in Node.js, reliance on external tools will decline, streamlining development. The key is to use tools that solve problems efficiently, whether it's tsx now or native support later. Focus on building great apps, not fighting tooling. 

Thanks for reading, and happy TypeScript development!