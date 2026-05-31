# Getting Started with Jiti

[Jiti](https://github.com/unjs/jiti) is a tool that lets you run TypeScript files directly in Node.js without compiling them first. The UnJS team built this lightweight loader, and it now powers major projects like Nuxt, Docusaurus, Tailwind CSS, and ESLint with over 60 million monthly downloads.

Jiti handles everything you need from a modern runtime loader. It transforms TypeScript code, resolves ES modules, loads JSON files, and caches everything intelligently. You can drop it into any existing Node.js project without changing your architecture, which makes it perfect for everything from simple scripts to complex applications.

This guide shows you how to use Jiti in your Node.js projects. You'll learn how to set it up, customize it for your needs, and optimize it for the best performance.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/u_GQSEjis48" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Prerequisites

You need a recent version of [Node.js](https://nodejs.org/en/download/) and `npm` on your machine before starting. This guide assumes you know the basics of [TypeScript](https://www.typescriptlang.org/) and understand how CommonJS and ES modules differ.

## Getting started with Jiti

Create a new Node.js project to practice the concepts you'll learn. Start by setting up a fresh project:

```command
mkdir jiti-demo && cd jiti-demo
```

```command
npm init -y
```

Enable ECMAScript module support:

```command
npm pkg set type=module
```

Install the latest version of [jiti](https://www.npmjs.com/package/jiti). These examples work with version 2.x, the current stable release:

```command
npm install jiti
```

Create a `loader.js` file in your project root:

```javascript
[label loader.js]
import { createJiti } from 'jiti';

const jiti = createJiti(import.meta.url);

export default jiti;
```

This code imports the `createJiti` function and exports a Jiti instance that can load TypeScript, ESM, CommonJS, and JSON files without any extra setup.

You'll learn about customization options later. For now, use the exported loader in a new `index.js` file:

```javascript
[label index.js]
import jiti from './loader.js';

// Load a TypeScript file at runtime
const result = jiti('./example.ts');
console.log('Loaded:', result);
```

Create the TypeScript file you're importing:

```typescript
[label example.ts]
interface User {
  name: string;
  age: number;
}

const user: User = {
  name: 'Alice',
  age: 30
};

function greetUser(user: User): string {
  return `Hello, ${user.name}! You are ${user.age} years old.`;
}

export default greetUser(user);
```

Save both files and run the program:

```command
node index.js
```

You'll see this output:

```text
[output]
Loaded: { default: 'Hello, Alice! You are 30 years old.' }
```

Notice that Jiti automatically detected your TypeScript file, transformed it instantly, and ran it without any compilation step. This shows Jiti's main strength: it makes development convenient while keeping execution efficient.

## Understanding Jiti's module resolution

One of the biggest headaches in modern JavaScript development is dealing with different module systems. Some packages use CommonJS (`module.exports`), others use ES modules (`export`), and you often need to mix TypeScript files with JavaScript files. Jiti solves this by understanding all these formats and making them work together automatically.

Let's see how this works in practice with some real examples.

### Working with mixed module formats

In most projects, you'll encounter different module formats. Maybe you have an old configuration file using CommonJS, some new TypeScript modules using ES module syntax, and third-party packages that use various formats. Normally, this creates import/export headaches, but Jiti handles it seamlessly.

Here's a practical example. First, create a traditional CommonJS module:

```javascript
[label commonjs-module.js]
// CommonJS module
const config = {
  database: {
    host: 'localhost',
    port: 5432
  },
  api: {
    version: 'v1',
    timeout: 5000
  }
};

module.exports = config;
```

This is the old-school way of exporting in Node.js. The `module.exports` syntax has been around since the beginning and many existing projects still use it.

Now create a modern TypeScript module using ES module syntax:

```typescript
[label esm-module.ts]
// ESM TypeScript module
export interface DatabaseConfig {
  host: string;
  port: number;
}

export interface ApiConfig {
  version: string;
  timeout: number;
}

export const defaultSettings = {
  environment: 'development',
  debug: true
};
```

This module uses TypeScript interfaces (which only exist during development) and ES module exports. Notice how different this looks from the CommonJS version - it uses `export` instead of `module.exports`.

Now here's where Jiti shines. You can import both of these completely different module formats in the same file:

```javascript
[label mixed-import.js]
import jiti from './loader.js';

// Import CommonJS module - Jiti converts it automatically
const config = jiti('./commonjs-module.js');
console.log('CommonJS config:', config);

// Import ESM TypeScript module - Jiti compiles TypeScript and handles ES modules
const esmModule = jiti('./esm-module.ts');
console.log('ESM module:', esmModule);
```

The magic happens in these two lines. When you call `jiti('./commonjs-module.js')`, Jiti sees it's a CommonJS file and automatically converts the `module.exports` to work with your ES module setup. When you call `jiti('./esm-module.ts')`, Jiti compiles the TypeScript, handles the type definitions, and converts the ES module exports to be compatible.

Run this example:

```command
node mixed-import.js
```

```text
[output]
CommonJS config: {
  database: { host: 'localhost', port: 5432 },
  api: { version: 'v1', timeout: 5000 }
}
ESM module: { defaultSettings: { environment: 'development', debug: true } }
```

Both imports work perfectly! You got the configuration object from the CommonJS file and the exported values from the TypeScript ES module. Without Jiti, you'd need to either convert all your files to the same format or use complex workarounds.

### JSON and dynamic imports

Jiti doesn't just handle JavaScript and TypeScript - it also loads JSON files directly and supports async imports for more complex scenarios.

Create a JSON configuration file:

```json
[label config.json]
{
  "appName": "JitiDemo",
  "version": "1.0.0",
  "features": {
    "authentication": true,
    "caching": true,
    "logging": false
  }
}
```

JSON files can't be imported directly in Node.js without special handling, but Jiti treats them as first-class modules:

```javascript
[label async-example.js]
import jiti from './loader.js';

// Synchronous JSON loading - Jiti parses JSON and returns the object
const config = jiti('./config.json');
console.log('Config loaded:', config.appName);

// Async import with error handling - useful for conditional loading
async function loadModuleAsync() {
  try {
    const module = await jiti.import('./example.ts');
    console.log('Async loaded:', module);
  } catch (error) {
    console.error('Failed to load module:', error);
  }
}

loadModuleAsync();
```

The first example shows synchronous JSON loading - `jiti('./config.json')` automatically parses the JSON file and returns a JavaScript object. You can immediately access properties like `config.appName`.

The second example shows async loading with `jiti.import()`. This is useful when you want to load modules conditionally, handle errors gracefully, or load modules that might not exist. The async version also works better with ES module imports that might have side effects.

Run this to see both in action:

```command
node async-example.js
```

```text
[output]
Config loaded: JitiDemo
Async loaded: { default: 'Hello, Alice! You are 30 years old.' }
```
The key insight here is that Jiti eliminates the friction between different file types and module systems. You don't need to think about whether something is CommonJS, ES modules, TypeScript, or JSON - Jiti handles the conversion automatically.


## CLI usage

One of Jiti's most powerful features is its command-line interface. Instead of setting up complex build processes, you can execute TypeScript files directly with the `jiti` command. This is perfect for scripts, automation tasks, and development workflows.

### Running TypeScript files directly

The simplest way to use Jiti is to run TypeScript files as if they were JavaScript:

```command
npx jiti file-name.ts
```

Let's create an `app.ts` with a practical example:

```typescript
[label app.ts]
interface Task {
  id: number;
  name: string;
  completed: boolean;
}

const tasks: Task[] = [
  { id: 1, name: 'Setup project', completed: true },
  { id: 2, name: 'Write documentation', completed: false },
  { id: 3, name: 'Deploy to production', completed: false }
];

function getIncompleteTasks(tasks: Task[]): Task[] {
  return tasks.filter(task => !task.completed);
}

const incomplete = getIncompleteTasks(tasks);
console.log(`You have ${incomplete.length} incomplete tasks:`);
incomplete.forEach(task => console.log(`- ${task.name}`));
```
This example shows TypeScript interfaces, typed functions, and array methods working together. The `Task` interface ensures type safety, while `getIncompleteTasks` has explicit input and return types.

Run it directly:


```command
npx jiti index.ts
```

```text
[output]
You have 2 incomplete tasks:
- Write documentation
- Deploy to production
```

When you run this command, Jiti loads your TypeScript file, compiles it in memory with full type checking, and executes the result immediately. No separate compilation step needed.

### Environment variables for debugging

You can control Jiti's behavior with environment variables:


Enable debug mode to see what Jiti is doing:

```command
JITI_DEBUG=1 npx jiti app.ts
```
This debug output shows Jiti's configuration, whether it found a cached version of your file, and how long the transformation took. The cached file (`90b55b14.mjs`) gets reused on subsequent runs for better performance.

Use a custom cache directory:

```text
[output]
[jiti] [init] version: 2.5.1 module-cache: true fs-cache: true rebuild-fs-cache: false interop-defaults: true
[jiti] [cache] [hit] ./app.ts ~> ./node_modules/.cache/jiti/jiti-demo-app.90b55b14.mjs
[jiti] [transpile] [esm] ./app.ts (1.049ms)
You have 2 incomplete tasks:
- Write documentation
- Deploy to production
```
This debug output shows Jiti's configuration, whether it found a cached version of your file, and how long the transformation took. The cached file (`90b55b14.mjs`) gets reused on subsequent runs for better performance.

Use a custom cache directory:

```command
JITI_CACHE_DIR=/tmp/jiti-cache npx jiti app.ts
```

This stores compiled files in `/tmp/jiti-cache` instead of the default location, useful for Docker containers or CI/CD pipelines.

## Configuring Jiti options

Now that you've seen Jiti's basic capabilities, you need to understand how to configure it for real projects. Jiti has many options that control how it transforms code, handles caching, and resolves modules. Getting these settings right makes the difference between a slow development experience and a fast, smooth workflow.

The basic `createJiti(import.meta.url)` setup works for simple examples, but production applications need more control.

### Essential configuration options

Let's create a more sophisticated loader that shows the most important configuration options:

```javascript
[label advanced-loader.js]
import { createJiti } from 'jiti';

const jiti = createJiti(import.meta.url, {
  // Enable filesystem caching - this is crucial for performance
  cache: true,
  
  // Control Node.js require cache behavior
  requireCache: false,
  
  // Better compatibility between CommonJS and ES modules
  interopDefault: true,
  
  // Debug mode - shows what Jiti is doing behind the scenes
  debug: process.env.NODE_ENV === 'development',
  
  // Source maps for better error messages and debugging
  sourcemap: true
});

export default jiti;
```

Each of these options solves a specific problem:

**`cache: true`** is the most important setting. When enabled, Jiti stores compiled versions of your files in `node_modules/.cache/jiti`. This means the first time you load a TypeScript file, Jiti compiles it and saves the result. Every subsequent load uses the cached version, making it much faster.

**`requireCache: false`** controls whether modules stay in Node.js's internal cache. During development, you want this set to `false` so you can make changes to your TypeScript files and see them immediately. In production, you might want `true` for better performance.

**`interopDefault: true`** fixes a common problem when mixing ES modules and CommonJS. Without this, you might need to access exports as `result.default` instead of just `result`. This option makes the behavior more predictable.

**`debug: true`** shows you exactly what Jiti is doing - which files it's transforming, how long it takes, and whether it's using cached versions. This is invaluable during development but should be disabled in production.

Let's see the difference caching makes:

```javascript
[label cache-demo.js]
import { createJiti } from 'jiti';

// Jiti with caching enabled
const jitiCached = createJiti(import.meta.url, {
  cache: true,
  debug: true
});

// Jiti without caching
const jitiUncached = createJiti(import.meta.url, {
  cache: false,
  debug: true
});

console.time('First load (cached)');
jitiCached('./example.ts');
console.timeEnd('First load (cached)');

console.time('Second load (cached)');
jitiCached('./example.ts');
console.timeEnd('Second load (cached)');

console.time('First load (uncached)');
jitiUncached('./example.ts');
console.timeEnd('First load (uncached)');

console.time('Second load (uncached)');
jitiUncached('./example.ts');
console.timeEnd('Second load (uncached)');
```

Run this example:

```command
node cache-demo.js
```

```text
[output]
jiti] [init] version: 2.5.1 module-cache: true fs-cache: true rebuild-fs-cache: false interop-defaults: true
[jiti] [init] version: 2.5.1 module-cache: true fs-cache: false rebuild-fs-cache: false interop-defaults: true
[jiti] [cache] [hit] ./example.ts ~> /var/folders/rr/372_1g9j1cbd1_zhrcc13s8m0000gn/T/jiti/jiti-demo-example.4f2e888f.cjs
[jiti] [transpile] [cjs] ./example.ts (1.267ms)
First load (cached): 3.184ms
Second load (cached): 0.196ms
First load (uncached): 0.08ms
Second load (uncached): 0.071ms
```
![Screenshot of the output](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/9907ae1a-5aea-4c2b-8eeb-ab6e0b76da00/public =1236x1136)


The debug output reveals several important insights. The first two lines show the initialization of both Jiti instances. Notice that the cached version shows `fs-cache: true` while the uncached version shows `fs-cache: false`.

The `[cache] [hit]` line shows that Jiti found a cached version of `example.ts` at a specific path with a hash (`4f2e888f`). This hash is generated from the content of your TypeScript file - if you change the file, the hash changes, and Jiti knows to recompile.

The timing results show the performance difference: the first cached load takes 3.184ms (including compilation and cache writing), but the second cached load only takes 0.196ms - over 16 times faster! The uncached version takes similar time for both loads because it recompiles every time.

In a real application with dozens of TypeScript files, this performance difference becomes dramatic. Caching can turn a 5-second startup time into a 300-millisecond startup time.

Understanding these configuration options is essential because they directly impact your development experience. Poor configuration can make your development server painfully slow, while good configuration makes TypeScript feel as fast as JavaScript.

## Final thoughts

This guide has shown you how Jiti transforms TypeScript development by eliminating the compile step. You've learned to load TypeScript files directly, mix different module formats seamlessly, execute scripts via CLI, and optimize performance through smart configuration.

The tool continues to evolve with new features and optimizations. Check the [official documentation](https://github.com/unjs/jiti) for the latest updates and advanced use cases.