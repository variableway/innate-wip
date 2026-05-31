# Getting Started with TSX

[TSX](https://github.com/privatenumber/tsx) is a fast TypeScript execution engine that runs code directly without compiling, based on esbuild's rapid transpilation. 

It offers seamless TypeScript execution with performance close to native JavaScript, making it a top choice for quick development iteration.

TSX includes essential features: supports the latest ECMAScript, handles module resolution, and processes advanced TypeScript syntax easily. It integrates well with Node.js, providing customization options for various workflows.

This guide covers setup to advanced use, helping you optimize TSX for your projects, from simple scripts to complex apps.


<iframe width="100%" height="315" src="https://www.youtube.com/embed/u_GQSEjis48" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Prerequisites

Before diving into the rest of this guide, double-check that you have the latest version of [Node.js](https://nodejs.org/en/download/) and `npm` installed on your computer. We assume you're familiar with the fundamentals of [TypeScript](https://www.typescriptlang.org/docs/) and Node.js development, so you're ready to go!

## Getting started with TSX

To make the most of this tutorial, set up a new TypeScript project where you can happily experiment with the concepts you'll discover. 


Begin by creating your project structure using these helpful commands:

```command
mkdir tsx-project && cd tsx-project
```

```command
npm init -y
```

Next, add TypeScript support by installing the necessary dependencies:

```command
npm install typescript @types/node --save-dev
```

Now install TSX globally or as a development dependency. The examples in this guide work with TSX version 4.x, which is the current stable release:

```command
npm install tsx --save-dev
```

Create a new `app.ts` file in your project root and add this TypeScript code:

```typescript
[label app.ts]
interface Greeting {
  message: string;
  timestamp: Date;
}

const createGreeting = (name: string): Greeting => {
  return {
    message: `Hello, ${name}!`,
    timestamp: new Date()
  };
};

const greeting = createGreeting('TypeScript Developer');
console.log(greeting);
```

This code shows TypeScript's type system with interfaces and typed functions that you'll run directly using TSX.

Now use TSX to run this TypeScript file without any compilation step:

```command
npx tsx app.ts
```

You should see output like this:

```json
[output]
{
  message: 'Hello, TypeScript Developer!',
  timestamp: 2025-08-05T12:06:38.639Z
}
```

The most impressive thing about this execution is how TSX handles TypeScript syntax directly. It processes interfaces, type annotations, and modern ECMAScript features without requiring a separate build process or configuration files.

## Running scripts and using watch mode

Now that you've successfully executed your first TypeScript file with TSX, let’s explore how you can use it for real-world development workflows. One of TSX’s biggest strengths is its ability to run scripts directly and re-run them automatically as you make changes — without compiling or restarting anything manually.

### Using TSX with `package.json` scripts

Instead of typing `npx tsx app.ts` every time, you can define a script inside your `package.json`:

```json
[label package.json]
"scripts": {
[highlight]
  "start": "tsx app.ts"
[/highlight]
}
```

Now run your TypeScript file with:

```command
npm run start
```

This keeps things clean and consistent, especially in larger projects.

### Enabling watch mode for instant feedback

TSX includes a built-in watch mode that automatically re-runs your script when files change — perfect for rapid iteration during development:

```command
npx tsx watch app.ts
```

You'll notice that TSX immediately executes the script and then stays running in the terminal, waiting for file changes.

To see it in action, open `app.ts` and slightly change the greeting message. For example, update the `createGreeting` function like this:

```typescript
[label app.ts]
...
const createGreeting = (name: string): Greeting => {
  return {
    message: `Hello, ${name}!`,
    timestamp: new Date(),
  };
};

[highlight]
const greeting = createGreeting("TSX user");
[/highlight]
console.log(greeting);
```

Save the file.

TSX will automatically detect the change and re-run the script, showing updated output like:

```json
[output]
{ message: 'Hello, TSX user!', timestamp: 2025-08-05T12:26:49.207Z }
```

You didn’t have to recompile or restart anything; TSX handled it instantly.


## Working with `tsconfig.json`

TSX automatically finds and respects your project's `tsconfig.json` file. This means your TypeScript compiler options are honored during execution. This seamless integration means your existing TypeScript configuration continues working without any changes.

### Setting up TypeScript configuration

Create a `tsconfig.json` file in your project root to configure how TSX handles your TypeScript code. To create a config file, run:

```command
npx tsc --init
```

This generates a comprehensive TypeScript configuration file with modern defaults. To make the most of TSX's features, add path aliases to your existing configuration. Update your tsconfig.json to include a baseUrl and paths section:

```json
[label tsconfig.json]
{
  // Visit https://aka.ms/tsconfig to read more about this file
  "compilerOptions": {
    // File Layout
    // "rootDir": "./src",
    // "outDir": "./dist",
    
    // Environment Settings
    // See also https://aka.ms/tsconfig/module
    "module": "nodenext",
    "target": "esnext",
    "types": [],
    
    // Other Outputs
    "sourceMap": true,
    "declaration": true,
    "declarationMap": true,
    
    // Stricter Typechecking Options
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    
    // Recommended Options
    "strict": true,
    "jsx": "react-jsx",
    "verbatimModuleSyntax": true,
    "isolatedModules": true,
    "noUncheckedSideEffectImports": true,
    "moduleDetection": "force",
    "skipLibCheck": true,
 [highlight]   
    // Path aliases for cleaner imports
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@utils/*": ["./src/utils/*"]
    }
[/highlight]
  },
[highlight]
  "include": ["src/**/*", "*.ts"],
  "exclude": ["node_modules", "dist"]
[/highlight]
}
```

One of the most valuable features is path aliases. Let's create a project structure that uses these configuration options:

```command
mkdir -p src/utils
```

Create a utility file:

```typescript
[label src/utils/formatter.ts]
export const formatMessage = (message: string, prefix: string = 'LOG'): string => {
  return `[${prefix}] ${new Date().toISOString()} - ${message}`;
};

export const formatObject = <T>(obj: T): string => {
  return JSON.stringify(obj, null, 2);
};
```

Now update the main file to use the path alias:

```typescript
[label src/app.ts]
import { formatMessage, formatObject } from '@utils/formatter';

interface UserData {
  id: number;
  name: string;
  email: string;
}

const userData: UserData = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com'
};

console.log(formatMessage('Processing user data'));
console.log(formatObject(userData));
```

Notice how we're importing from `@utils/formatter` instead of `./utils/formatter` or `../utils/formatter`. This path alias makes imports cleaner and more maintainable, especially as your project grows larger.

Execute the file using the path alias configuration:

```command
npx tsx app.ts    
```

```text
[output]
[LOG] 2025-08-05T13:26:19.943Z - Processing user data
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com"
}
```

TSX resolves the path aliases defined in your TypeScript configuration. This shows its deep integration with the TypeScript ecosystem.

### Understanding TSX's approach to type checking

Here's something important to understand: **TSX does not perform type checking during execution**. Instead, it focuses on fast transpilation and execution, leaving type checking to be handled separately by your development tools.

This separation is a feature, not a limitation. It allows TSX to execute your code quickly without being blocked by type errors, while you still get the benefits of TypeScript's type system through your IDE or separate type checking steps.

For actual type checking, use the TypeScript compiler:

```command
npx tsc --noEmit
```

This workflow lets you iterate faster on functionality and treat type errors as linting issues rather than execution blockers. Your IDE will still show type errors in real-time, and you can run type checking as part of your development process when needed.

### Custom tsconfig.json path

If your TypeScript configuration file is in a custom location, you can specify it using the `--tsconfig` flag:

```command
tsx --tsconfig ./config/tsconfig.custom.json src/main.ts
```

This flexibility allows you to use different TypeScript configurations for different parts of your project or different environments.


## Node.js native TypeScript support

Node.js has been adding native TypeScript support through experimental features that work alongside TSX. Understanding these built-in capabilities helps you choose the right approach for your projects.

### Type stripping with `--experimental-strip-types`

Node.js can now strip TypeScript types natively using the `--experimental-strip-types` flag:

```command
node --experimental-strip-types filename.ts
```

This feature removes TypeScript type annotations and executes the resulting JavaScript, similar to how TSX works but using Node.js's built-in capabilities. 

The key difference is that this runs entirely within Node.js without any external dependencies, making it useful for environments where you want to minimize your toolchain.

Create a TypeScript file to test this feature:

```typescript
[label native-types-example.ts]
interface User {
  id: number;
  name: string;
  isActive: boolean;
}

const createUser = (name: string): User => {
  return {
    id: Math.floor(Math.random() * 1000),
    name,
    isActive: true
  };
};

const user = createUser('Native TypeScript User');
console.log('Created user:', user);
```

Run it with Node.js native type stripping:

```command
node --experimental-strip-types native-types-example.ts
```

```text
[output]
Created user: { id: 98, name: 'Native TypeScript User', isActive: true }
(node:85308) ExperimentalWarning: Type Stripping is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
```

Notice the experimental warning - this indicates the feature is still in development. While it works well for basic TypeScript syntax, it doesn't support all TypeScript features yet. 

The type stripping approach focuses on removing type annotations rather than full TypeScript compilation, which makes it faster but less comprehensive than TSX's esbuild-based approach.

This native support is particularly useful for simple scripts, CI/CD environments, or situations where you want to avoid installing additional packages while still benefiting from TypeScript's type safety during development.

### TSX vs Node.js native support

Here's when to use each approach:

**Use TSX when:**

- You need maximum compatibility with TypeScript features
- You want the fastest execution and watch mode performance
- You're working with complex TypeScript projects
- You need reliable production-ready TypeScript execution

**Use Node.js native support when:**

- You want to minimize dependencies
- You're working with simpler TypeScript code
- You prefer using built-in Node.js features
- You're experimenting with cutting-edge Node.js capabilities

### Combining approaches

You can even use both approaches in the same project. For example, use TSX for development with its excellent watch mode, and Node.js native support for specific deployment scenarios:

```json
[label package.json]
{
  "scripts": {
    "dev": "tsx watch src/app.ts",
    "start:native": "node --experimental-strip-types src/app.ts",
    "start": "tsx src/app.ts"
  }
}
```

Keep in mind that Node.js native TypeScript support is still experimental and may not support all TypeScript features that TSX handles seamlessly. TSX remains the more mature and feature-complete solution for TypeScript execution.

## Final thoughts

You've now explored TSX's core capabilities - from basic setup to advanced configuration with `tsconfig.json` and compared it with Node.js native TypeScript support. TSX eliminates traditional compilation steps while maintaining full TypeScript compatibility, making it invaluable for development workflows.

Start by integrating TSX into your development scripts and watch mode workflows where its speed advantages shine. As you get comfortable, expand its usage to other areas of your TypeScript projects. TSX's mature ecosystem and reliable performance make it the go-to choice for most TypeScript execution needs, while Node.js native support offers an interesting alternative for simpler use cases.

For more advanced features and configuration options, check out the [official TSX documentation](https://github.com/privatenumber/tsx).

Thanks for reading, and happy TypeScript development with TSX!
