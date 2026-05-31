# Understanding module resolution in TypeScript

Module resolution determines how TypeScript locates and loads the files your code imports, connecting import statements to their actual file locations on disk. This process controls whether TypeScript finds your dependencies, how it interprets bare module specifiers like `import express from "express"`, and whether your compiled code runs correctly in Node.js or browsers. Configurable through multiple compiler options, **module resolution bridges the gap between how you write imports and how JavaScript runtimes actually load modules**, ensuring your development experience matches your deployment environment.

Rather than manually tracking down file paths or debugging cryptic "cannot find module" errors, you **configure module resolution to match your runtime and build tools automatically**. This approach prevents import mismatches between development and production, makes your build configuration explicit about how modules load, and creates code that works reliably across different JavaScript environments.

In this guide, you'll learn how TypeScript's module resolution strategies work and when to use each one, how to configure resolution for Node.js and browser environments, and how to handle common resolution issues with path mappings and package exports.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/vcVoyLQMCxU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Prerequisites

To follow this guide, you'll need Node.js 18+:

```command
node --version
```

```text
[output]
v22.19.0
```

## Setting up the project

Create and configure a new TypeScript project:

```command
mkdir ts-module-resolution && cd ts-module-resolution
```

Initialize with ES modules:

```command
npm init -y && npm pkg set type="module"
```

Install dependencies:

```command
npm install -D typescript @types/node tsx
```

Create a TypeScript configuration:

```command
npx tsc --init
```

This generates a `tsconfig.json` file with TypeScript's recommended defaults, which includes `"moduleResolution": "bundler"` in modern versions. You now have a working environment for exploring how different module resolution strategies affect import behavior.

## Understanding module resolution without explicit configuration

TypeScript resolves imports by searching for files that match your import statements, following rules that vary based on your module resolution strategy. Without explicit configuration, TypeScript uses resolution rules based on your `module` setting, which may not match how your runtime or bundler actually resolves modules. This mismatch creates situations where TypeScript accepts imports that fail at runtime or requires workarounds that shouldn't be necessary.

Let's create a simple project structure to observe default resolution behavior:

```command
mkdir -p src/utils src/services
```

Create a utility module:

```typescript
[label src/utils/formatter.ts]
export function formatMessage(message: string): string {
  return `[INFO] ${message}`;
}

export function formatError(error: string): string {
  return `[ERROR] ${error}`;
}
```

Create a service that imports the utility:

```typescript
[label src/services/logger.ts]
import { formatMessage, formatError } from "../utils/formatter";

export class Logger {
  log(message: string): void {
    console.log(formatMessage(message));
  }

  error(message: string): void {
    console.error(formatError(message));
  }
}
```

Create a main file:

```typescript
[label src/index.ts]
import { Logger } from "./services/logger";

const logger = new Logger();
logger.log("Application started");
logger.error("Sample error");
```

Compile with default settings:

```command
npx tsc
```

Examine the compiled output:

```command
cat src/index.js
```

The imports in the compiled JavaScript maintain the same relative paths you wrote. However, when you run this in Node.js, you might encounter issues depending on your module system configuration.

Run the compiled code:

```command
node src/index.js
```

```text
[output]
Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/Users/username/ts-module-resolution/src/services/logger' imported from /Users/username/ts-module-resolution/src/index.js
```

The code fails at runtime because Node.js requires explicit file extensions for ES modules, but TypeScript didn't add them during compilation. This demonstrates how default module resolution can create a disconnect between compile-time success and runtime failure.

## Configuring module resolution for Node.js

TypeScript provides specific resolution strategies designed for Node.js environments. The `node16` and `nodenext` strategies understand Node.js's module resolution algorithm, including how it handles package.json exports, conditional exports, and the difference between CommonJS and ES modules. Using these strategies ensures TypeScript's resolution behavior matches Node.js runtime behavior.

Update your configuration for Node.js:

```json
[label tsconfig.json]
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "nodenext",
    "moduleResolution": "nodenext",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true
  }
}
```

Compile with Node.js resolution:

```command
npx tsc
```

```text
[output]
src/services/logger.ts:1:42 - error TS2835: Relative import paths need explicit file extensions in ECMAScript imports when '--moduleResolution' is 'node16' or 'nodenext'. Did you mean '../utils/formatter.js'?

1 import { formatMessage, formatError } from "../utils/formatter";
                                               ~~~~~~~~~~~~~~~~~~~~

src/index.ts:1:26 - error TS2835: Relative import paths need explicit file extensions in ECMAScript imports when '--moduleResolution' is 'node16' or 'nodenext'. Did you mean './services/logger.js'?

1 import { Logger } from "./services/logger";
                           ~~~~~~~~~~~~~~~~~~~

Found 2 errors in 2 files.

Errors  Files
     1  src/index.ts:1
     1  src/services/logger.ts:1
```

TypeScript now reports that relative imports need explicit `.js` extensions. This matches Node.js's ES module behavior, where extensions are mandatory. Fix the imports:

```typescript
[label src/services/logger.ts]
[highlight]
import { formatMessage, formatError } from "../utils/formatter.js";
[/highlight]

export class Logger {
  log(message: string): void {
    console.log(formatMessage(message));
  }

  error(message: string): void {
    console.error(formatError(message));
  }
}
```

```typescript
[label src/index.ts]
[highlight]
import { Logger } from "./services/logger.js";
[/highlight]

const logger = new Logger();
logger.log("Application started");
logger.error("Sample error");
```

Compile again:

```command
npx tsc
```

Run the corrected code:

```command
node dist/index.js
```

```text
[output]
[INFO] Application started
[ERROR] Sample error
```

The code now runs successfully because TypeScript's resolution strategy matches Node.js's requirements. Note that you write `.js` extensions in your TypeScript imports even though the source files have `.ts` extensions. This is intentional because TypeScript preserves the extensions you write, and Node.js expects `.js` at runtime.

## Understanding different resolution strategies

TypeScript offers several module resolution strategies, each designed for different environments and build tools. The strategy you choose affects how TypeScript interprets import paths, whether it requires file extensions, and how it resolves packages from node_modules.

The main resolution strategies are:

**node16/nodenext**: Matches Node.js's native module resolution algorithm. Requires explicit file extensions for relative imports in ES modules, understands package.json exports fields, and handles both CommonJS and ES modules correctly. Use this for Node.js applications.

**bundler**: Designed for build tools like webpack, Rollup, and esbuild. Doesn't require file extensions, allows importing JSON and CSS files, and assumes the bundler will handle module resolution. Use this when a bundler processes your code.

**node10** (formerly called just "node"): Uses Node.js's legacy CommonJS resolution algorithm. Doesn't require file extensions and doesn't understand modern package.json features. Deprecated in favor of node16/nodenext.

**classic**: TypeScript's original resolution strategy. Rarely used in modern projects. Only included for backward compatibility.

Let's compare how these strategies handle the same imports. First, configure for bundler resolution:

```json
[label tsconfig.json]
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "esnext",
    "moduleResolution": "bundler",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true
  }
}
```

Revert the imports to not use extensions:

```typescript
[label src/services/logger.ts]
[highlight]
import { formatMessage, formatError } from "../utils/formatter";
[/highlight]

export class Logger {
  log(message: string): void {
    console.log(formatMessage(message));
  }

  error(message: string): void {
    console.error(formatError(message));
  }
}
```

```typescript
[label src/index.ts]
[highlight]
import { Logger } from "./services/logger";
[/highlight]

const logger = new Logger();
logger.log("Application started");
logger.error("Sample error");
```

Compile with bundler resolution:

```command
npx tsc
```

The code compiles successfully without requiring file extensions because bundler resolution assumes a build tool will handle module resolution. This configuration is appropriate when using webpack, Vite, or other bundlers that resolve modules during the build process.

## Resolving packages from node_modules

Module resolution also determines how TypeScript finds packages installed in node_modules. The resolution strategy affects whether TypeScript looks at package.json exports fields, how it handles conditional exports for different environments, and which files it considers as entry points.

Install a sample package:

```command
npm install date-fns
```

Create a file that imports from the package:

```typescript
[label src/date-handler.ts]
import { format, addDays } from "date-fns";

export function formatDate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function getNextWeek(date: Date): Date {
  return addDays(date, 7);
}

export function displayNextWeek(): void {
  const today = new Date();
  const nextWeek = getNextWeek(today);
  console.log(`Today: ${formatDate(today)}`);
  console.log(`Next week: ${formatDate(nextWeek)}`);
}
```

Update the main file to use this module:

```typescript
[label src/index.ts]
import { Logger } from "./services/logger.js";
import { displayNextWeek } from "./date-handler.js";

const logger = new Logger();
logger.log("Application started");

displayNextWeek();
```

```typescript
[label src/services/logger.ts]
[highlight]
import { formatMessage, formatError } from "../utils/formatter.js";
[/highlight]

...
```

With node16/nodenext resolution configured:

```json
[label tsconfig.json]
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "nodenext",
    "moduleResolution": "nodenext",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true
  }
}
```

Compile and run:

```command
npx tsc && node dist/index.js
```

```text
[output]
[INFO] Application started
Today: 2024-12-02
Next week: 2024-12-09
```

TypeScript resolves the date-fns package by examining its package.json exports field, which specifies which files should be accessible and how they map to different module systems. The node16/nodenext strategy understands these modern package.json features.

## Final thoughts

**Module resolution connects your import statements to actual files, ensuring TypeScript's type checking matches how your runtime loads modules**. By configuring resolution strategies that align with your deployment environment, you prevent mismatches between development and production, eliminate cryptic module-not-found errors, and create builds that work reliably. Starting with the resolution strategy that matches your runtime (node16/nodenext for Node.js, bundler for webpack/Vite) establishes a foundation where imports behave predictably.

In practice, module resolution configuration transforms import handling from a source of runtime errors into a build-time guarantee. **You configure resolution once based on your environment, and TypeScript ensures every import can be resolved before your code runs**, catching broken imports during development rather than in production. Path mappings and package.json exports provide additional control over how modules organize and expose functionality.

If you want to explore these concepts further, you can examine the [TypeScript module resolution documentation](https://www.typescriptlang.org/docs/handbook/module-resolution.html), which explains resolution algorithms in detail and provides guidance for configuring complex project structures with multiple resolution requirements.