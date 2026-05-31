# TypeScript + SWC: An Introduction

[SWC](https://swc.rs/) is a TypeScript and JavaScript compiler written in Rust that has changed how developers handle code compilation and bundling. Its incredible speed made it the default choice for modern build tools like [Next.js](https://nextjs.org/docs/architecture/nextjs-compiler) and [Turbopack](https://turbo.build/pack), where compilation speed matters most.

SWC includes all the essential features you expect from a modern compiler: TypeScript type stripping, JSX transformation, module bundling, and code minification. What makes it special is how easily you can extend and configure it to match your specific project requirements and deployment needs.

This guide will show you how to integrate SWC with TypeScript in your development workflow. You'll learn how to use SWC's powerful features and optimize them for maximum performance in your specific use case.

[ad-logs]

## Prerequisites

Before you begin, make sure you have the latest version of [Node.js](https://nodejs.org/en/download/) and `npm` installed on your computer. This guide also assumes you're familiar with [TypeScript basics](https://www.typescriptlang.org/docs/) and have a general understanding of how JavaScript gets compiled.

## Setting up your project

To follow along more easily, it's best to create a new TypeScript project where you can try out the examples. You can set it up using the commands below:

```command
mkdir typescript-swc-project && cd typescript-swc-project
```

```command
npm init -y
```

Next, configure your project to support modern ECMAScript modules:

```command
npm pkg set type=module
```

Now install TypeScript and SWC core dependencies. The examples in this article work with SWC version 1.11.x, which is the current stable release:

```command
npm install --save-dev @swc/core @swc/cli typescript @types/node
```

Create a basic TypeScript configuration file `tsconfig.json` in your project root:

```json
[label tsconfig.json]
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "node",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

This configuration creates a solid foundation for TypeScript development with modern JavaScript features enabled and comprehensive type checking activated.

## Configuring SWC for TypeScript compilation

SWC works through a configuration file that tells it how to transform your TypeScript code. Create a `.swcrc` file in your project root with this initial setup:

```json
[label .swcrc]
{
  "$schema": "https://json.schemastore.org/swcrc",
  "jsc": {
    "parser": {
      "syntax": "typescript",
      "tsx": false,
      "decorators": true,
      "dynamicImport": true
    },
    "target": "es2022",
    "loose": false,
    "externalHelpers": false,
    "keepClassNames": true,
    "preserveAllComments": false
  },
  "module": {
    "type": "es6",
    "strict": false,
    "strictMode": true,
    "lazy": false,
    "noInterop": false
  },
  "minify": false,
  "sourceMaps": true
}
```

This configuration tells SWC to parse TypeScript syntax, target ES2022 for optimal modern browser support, and generate source maps for debugging. The `jsc` section controls the JavaScript compiler settings, while the `module` section determines how modules are handled in the output.

Let's create a sample TypeScript file to test your setup. Create a `src` directory and add an `index.ts` file:

```typescript
[label src/index.ts]
interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

class UserService {
  private users: User[] = [];

  async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const newUser: User = {
      id: Math.floor(Math.random() * 10000),
      createdAt: new Date(),
      ...userData
    };
    
    this.users.push(newUser);
    console.log(`Created user: ${newUser.name} (${newUser.email})`);
    return newUser;
  }

  async getUserById(id: number): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  async getAllUsers(): Promise<User[]> {
    return [...this.users];
  }
}

// Example usage
const userService = new UserService();

async function main() {
  try {
    const user = await userService.createUser({
      name: 'Alice Johnson',
      email: 'alice@example.com'
    });

    console.log('User created successfully:', user);

    const allUsers = await userService.getAllUsers();
    console.log('All users:', allUsers);
  } catch (error) {
    console.error('Error occurred:', error);
  }
}

main();
```
This code defines a `User` interface and a `UserService` class that lets you create and fetch users in memory. It includes methods to create a user, get a user by ID, and get all users. The `main()` function shows how to use the service by creating a user and logging the results.


Now add build scripts to your `package.json` file:

```json
[label package.json]
{
  ...
  "scripts": {
[highlight]
    "build": "swc src -d dist --copy-files --strip-leading-paths",
    "build:watch": "swc src -d dist --watch --copy-files --strip-leading-paths",
    "type-check": "tsc --noEmit",
    "dev": "npm run build && node dist/index.js",
    "clean": "rm -rf dist"
[/highlight]
  }
}
```

Run the build process with this command:

```command
npm run build
```

You should see SWC quickly compile your TypeScript code into JavaScript in the `dist` directory. The compilation speed difference compared to the standard TypeScript compiler becomes obvious even with this simple example.

Run the compiled code to verify everything works:

```command
npm run dev
```

You should see output like this:

```text
[output]
Created user: Alice Johnson (alice@example.com)
User created successfully: {
  id: 2847,
  createdAt: 2025-06-11T07:26:16.631Z,
  name: 'Alice Johnson',
  email: 'alice@example.com'
}
All users: [
  {
    id: 2847,
    createdAt: 2025-06-11T07:26:16.631Z,
    name: 'Alice Johnson',
    email: 'alice@example.com'
  }
]
```
The output confirms that everything is working correctly — your code compiled successfully, the user was created, and the service returned the expected data.


## Understanding SWC's TypeScript compilation modes

SWC offers different approaches to handling TypeScript compilation, each optimized for specific use cases and development workflows. The key difference lies in how SWC handles typechecking compared to traditional TypeScript compilation.

Traditional TypeScript compilation (using tsc) performs both type checking and code transformation in a single step, which can be slow for large projects. SWC takes a different approach by separating these concerns, giving you flexibility in how you want to handle type safety versus compilation speed.

![SWC vs TypeScript Compiler Workflow Comparison](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/719f9635-8ea4-4b84-cf9b-458678726e00/orig =2272x1196)

This workflow comparison shows three different approaches: the traditional TypeScript compiler that does everything in one slow step, SWC's type-stripping mode that prioritizes speed by skipping type validation, and SWC's combined approach that gives you both speed and type safety by running type checking and compilation as separate steps.

Let's explore these modes so you can choose the best approach for your project.

### Type-stripping mode (default)

SWC is currently running in type-stripping mode, which removes TypeScript type annotations without performing type checking. This is why your build was so fast in the previous step—SWC skips the time-consuming type checking phase entirely.

To see this in action, let's introduce a deliberate type error in your code. Remember that your `createUser` method expects an object with only `name` and `email` properties (since `id` and `createdAt` are generated automatically). Here's a quick reminder of what you defined earlier:

```typescript
// Your User interface
interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

// Your createUser method signature
async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User>
```

The `Omit<User, 'id' | 'createdAt'>` type means the method only accepts an object with `name` and `email` properties. Let's add a property that doesn't exist in this type to see how SWC handles it.

Open `src/index.ts` and modify the `createUser` call:

```typescript
[label src/index.ts]
async function main() {
  try {
    const user = await userService.createUser({
      name: 'Alice Johnson',
      email: 'alice@example.com',
[highlight]
      invalidProperty: true // This property doesn't exist in Omit<User, 'id' | 'createdAt'>
[/highlight]
    });

    console.log('User created successfully:', user);

    const allUsers = await userService.getAllUsers();
    console.log('All users:', allUsers);
  } catch (error) {
    console.error('Error occurred:', error);
  }
}
```

The `invalidProperty` is invalid because it's not part of the expected `{ name: string; email: string }` type that `createUser` expects.

Now run your build:

```command
npm run build
```
```text
[output]
> typescript-swc-project@1.0.0 build
> swc src -d dist --copy-files --strip-leading-paths

Successfully compiled: 1 file with swc (77.17ms)
```
Notice that SWC compiles successfully, even though you added an invalid property. This is type-stripping mode in action—SWC removes the types but doesn't validate them.

Run the code to see what happens:

```command
npm run dev
```

The code runs fine because JavaScript doesn't care about the extra property. However, this could hide real bugs in your application.

### Adding type checking for safety

For production builds where type safety is crucial, you should run TypeScript's type checker alongside SWC. Test this by running:

```command
npm run type-check
```

Now you'll see a TypeScript error:

![Screenshot of the TypeScript error](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/510aba60-d9f4-4a3d-dedd-4216b4819e00/md2x =1404x1170)


This shows you how to catch type errors before deployment while still enjoying SWC's fast compilation. Remove the `invalidProperty` line to fix the error:

```typescript
[label src/index.ts]
const user = await userService.createUser({
  name: 'Alice Johnson',
  email: 'alice@example.com'
[highlight]
  // invalidProperty: true - removed to fix type error
[/highlight]
});
```


For the best of both worlds, add a production build script to your `package.json`:

```json
[label package.json]
{
  "scripts": {
    "build": "swc src -d dist --copy-files --strip-leading-paths",
    "build:watch": "swc src -d dist --watch --copy-files --strip-leading-paths",
    "type-check": "tsc --noEmit",
[highlight]
    "build:production": "npm run type-check && npm run build",
[/highlight]
    "dev": "npm run build && node dist/index.js",
    "clean": "rm -rf dist"
  }
}
```

Now you can use:
- `npm run build` for fast development builds
- `npm run build:production` for type-safe production builds
- `npm run type-check` to validate types without compiling

This approach gives you rapid compilation during development and comprehensive type safety validation for production builds.


## Improving developer experience with watch mode

While the basic `build` and `dev` scripts work well for testing things manually, you'll often want to see changes reflected instantly as you code. That's where **watch mode** becomes essential for productive development.

You already have a `build:watch` script in your `package.json`, but before you can use SWC's watch mode, you need to install its file watching dependency.

### Setting up SWC watch mode

SWC's watch functionality requires the `chokidar` package for file system monitoring. Install it as a development dependency:

```command
npm install --save-dev chokidar
```

Now try running the watch build:

```command
npm run build:watch
```

You should see output like:

```text
[output]

> typescript-swc-project@1.0.0 build:watch
> swc src -d dist --watch --copy-files --strip-leading-paths

Successfully compiled: 1 file with swc (60.82ms)
Watching for file changes.
```
SWC is now monitoring your `src/` directory for any changes. Let's test it to see how fast it really is.

Keep the watch process running and open `src/index.ts` in your editor. Make a small change, like adding a `console.log` statement:

```typescript
[label src/index.ts]
async function main() {
  try {
[highlight]
    console.log('Starting user creation process...');
[/highlight]
    const user = await userService.createUser({
      name: 'Alice Johnson',
      email: 'alice@example.com'
    });

    console.log('User created successfully:', user);
    // ... rest stays the same
  }
}
```

As soon as you save the file, watch your terminal. You should see something like:

```text
[output]
Successfully compiled src/index.ts with swc (2.78ms)
```

Notice how incredibly fast that was—under 10 milliseconds! This is where SWC's performance really shines compared to other TypeScript compilers.

SWC's watch mode monitors all files that match the patterns you've configured. In your current setup, it's watching:

- All `.ts` files in the `src/` directory and subdirectories
- Any files that get imported by your TypeScript code


## Testing with SWC and Vitest

Testing is a crucial part of any TypeScript project, and SWC's speed advantages become even more apparent when running tests. Instead of waiting for slow compilation during test runs, SWC can compile your TypeScript test files almost instantly.

Let's set up a testing environment using Vitest, a fast test runner that works excellently with SWC.

### Installing Vitest and SWC integration

Install Vitest and the necessary SWC integration packages:

```command
npm install --save-dev vitest @swc/core unplugin-swc
```

Vitest is a modern test runner built by the Vite team that's designed for speed and simplicity. The `unplugin-swc` package provides seamless integration between Vitest and SWC.

### Configuring Vitest with SWC

Create a `vitest.config.ts` file in your project root:

```typescript
[label vitest.config.ts]
import { defineConfig } from 'vitest/config';
import swc from 'unplugin-swc';

export default defineConfig({
  plugins: [
    swc.vite({
      jsc: {
        parser: {
          syntax: 'typescript',
          decorators: true,
        },
        target: 'es2022',
        keepClassNames: true,
      },
      module: {
        type: 'es6',
      },
      sourceMaps: true,
    }),
  ],
  test: {
    globals: true,
    environment: 'node',
  },
});
```

This configuration tells Vitest to use SWC for compiling TypeScript files during testing, with the same settings you've been using for your main project.

### Writing your first test

Let's write a simple test for the `UserService` class you created earlier. Create a `src/__tests__` directory and add a test file:

```command
mkdir -p src/__tests__
```

```typescript
[label src/__tests__/UserService.test.ts]
import { describe, it, expect, beforeEach } from 'vitest';

// We need to create a separate UserService for testing
interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

class UserService {
  private users: User[] = [];

  async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const newUser: User = {
      id: Math.floor(Math.random() * 10000),
      createdAt: new Date(),
      ...userData
    };
    
    this.users.push(newUser);
    return newUser;
  }

  async getUserById(id: number): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  async getAllUsers(): Promise<User[]> {
    return [...this.users];
  }
}

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
  });

  it('should create a new user with generated id and timestamp', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com'
    };

    const createdUser = await userService.createUser(userData);

    expect(createdUser).toHaveProperty('id');
    expect(createdUser).toHaveProperty('createdAt');
    expect(createdUser.name).toBe(userData.name);
    expect(createdUser.email).toBe(userData.email);
    expect(typeof createdUser.id).toBe('number');
    expect(createdUser.createdAt).toBeInstanceOf(Date);
  });
});
```

Update your `package.json` to include test scripts:

```json
[label package.json]
{
  "scripts": {
    "build": "swc src -d dist --copy-files --strip-leading-paths",
    "build:watch": "swc src -d dist --watch --copy-files --strip-leading-paths",
    "type-check": "tsc --noEmit",
    "build:production": "npm run type-check && npm run build",
    "dev": "npm run build && node dist/index.js",
[highlight]
    "test": "vitest run",
    "test:watch": "vitest",
[/highlight]
    "clean": "rm -rf dist"
  }
}
```

Now run your test:

```command
npm test
```

You should see output like this:

```text
[output]
 RUN  v3.2.3 /Users/stanley/typescript-swc-project

 ✓ src/__tests__/UserService.test.ts (1 test) 1ms
   ✓ UserService > should create a new user with generated id and timestamp 1ms

 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  13:06:39
   Duration  318ms (transform 54ms, setup 0ms, collect 47ms, tests 1ms, environment 0ms, prepare 58ms)
```

Notice how fast the test ran—SWC compiled your TypeScript test file almost instantly! This speed advantage becomes even more significant as your test suite grows larger.

## Final thoughts

By switching to SWC, you can significantly accelerate your TypeScript build process without compromising flexibility or control. 

This guide walked you through setting up a project, configuring both SWC and TypeScript and understanding how SWC handles type checking and rebuilds. 

For more advanced use cases or customization options, the official [SWC documentation](https://swc.rs/docs/configuration/swcrc) and [GitHub repository](https://github.com/swc-project/swc) are excellent resources for further learning.