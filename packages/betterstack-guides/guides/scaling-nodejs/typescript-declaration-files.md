# Understanding Declaration Files in TypeScript

Declaration files provide TypeScript with type information about JavaScript code that exists without type annotations, enabling type checking and autocomplete for libraries, modules, and APIs written in plain JavaScript. These `.d.ts` files contain only type declarations—interfaces, type aliases, function signatures—without any implementation code. They act as a contract between untyped JavaScript and TypeScript's type system. **Declaration files let you add TypeScript's safety and developer experience to any JavaScript codebase**, making it possible to use third-party libraries, legacy code, and existing JavaScript modules with full type support.

Instead of losing type safety when working with JavaScript files or writing type-unsafe code to interface with untyped modules, you **create declaration files to describe the shape and behavior of JavaScript constructs**. This approach brings IDE autocomplete, compile-time error checking, and documentation directly into your workflow when working with code that wasn't originally written in TypeScript.

In this guide, you'll learn what declaration files contain and how TypeScript uses them to type-check JavaScript, how to write declarations for existing JavaScript files, and how TypeScript automatically discovers and applies declaration files in your project.

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
mkdir ts-declarations && cd ts-declarations
```

Initialize with ES modules:

```command
npm init -y
```
```command
npm pkg set type="module"
```

Install development dependencies:

```command
npm install -D typescript @types/node tsx
```

Create a TypeScript configuration:

```command
npx tsc --init
```

This generates a `tsconfig.json` file with TypeScript's default settings. You now have a working environment for exploring how declaration files work with JavaScript code.

## Understanding JavaScript without type information

When you work with JavaScript files in a TypeScript project, TypeScript treats them as valid but provides no type checking or autocomplete beyond basic inference. The JavaScript runs fine, but you lose the safety and developer experience that TypeScript normally provides. This creates a gap where bugs can hide, especially when the JavaScript contains complex logic or public APIs that other code depends on.

Let's create a JavaScript module with several functions:

```javascript
[label src/math-utils.js]
export class Calculator {
  constructor() {
    this.history = [];
  }

  add(a, b) {
    const result = {
      value: a + b,
      operation: "addition",
      timestamp: new Date()
    };
    this.history.push(result);
    return result;
  }

  multiply(a, b) {
    const result = {
      value: a * b,
      operation: "multiplication",
      timestamp: new Date()
    };
    this.history.push(result);
    return result;
  }

  getHistory() {
    return [...this.history];
  }
}

export function formatResult(result) {
  return `${result.operation}: ${result.value} (${result.timestamp.toISOString()})`;
}

export const VERSION = "1.0.0";
```

Create a TypeScript file that uses this JavaScript module:

```typescript
[label src/app.ts]
import { Calculator, formatResult, VERSION } from "./math-utils.js";

const calc = new Calculator();
const result = calc.add(5, 10);

console.log(formatResult(result));
console.log("Version:", VERSION);
console.log("History:", calc.getHistory());
```

Configure TypeScript to allow JavaScript files:

```json
[label tsconfig.json]
{
  "compilerOptions": {
    "module": "nodenext",
    "target": "esnext",
    "outDir": "./dist",
    "rootDir": "./src",
[highlight]
    "allowJs": true,
[/highlight]
    "sourceMap": true,
    "declaration": true,
    "declarationMap": true,
    "strict": true,
    "verbatimModuleSyntax": true,
    "skipLibCheck": true
  }
}
```

Compile the project:

```command
npx tsc
```

The compilation succeeds, but if you open `src/app.ts` in an IDE, you'll notice that TypeScript infers very basic types. Hover over `calc` and you'll see it's typed as `Calculator`, but the class methods show minimal type information. Parameters appear as `any`, return types are inferred loosely, and there's no documentation or constraints on what you can pass to methods.

Try introducing an error by passing wrong argument types:

```typescript
[label src/app.ts]
import { Calculator, formatResult, VERSION } from "./math-utils.js";

const calc = new Calculator();
const result = calc.add("5", "10"); // Wrong types
const badResult = calc.multiply(5); // Missing argument

console.log(formatResult(result));
console.log("Version:", VERSION);
console.log("History:", calc.getHistory());
```

Compile again:

```command
npx tsc
```

The compilation succeeds despite these obvious mistakes. TypeScript can't catch the errors because it doesn't know what types the JavaScript functions expect. The code will fail at runtime when `a + b` performs string concatenation instead of addition.

## Adding declaration files for type safety

Declaration files bridge this gap by providing explicit type information for JavaScript code. When you create a `.d.ts` file alongside a JavaScript file with the same base name, TypeScript automatically discovers and applies those type declarations. This happens without any additional configuration—TypeScript looks for declaration files by default and uses them to type-check imports from the corresponding JavaScript.

Create a declaration file for the math utilities:

```typescript
[label src/math-utils.d.ts]
export interface CalculationResult {
  value: number;
  operation: string;
  timestamp: Date;
}

export class Calculator {
  add(a: number, b: number): CalculationResult;
  multiply(a: number, b: number): CalculationResult;
  getHistory(): CalculationResult[];
}

export function formatResult(result: CalculationResult): string;

export const VERSION: string;
```

The declaration file describes the public API of `math-utils.js` using TypeScript's type syntax. Each exported item gets a type signature: the `Calculator` class lists its public methods with parameter and return types, the `formatResult` function specifies its signature, and the `VERSION` constant is typed as a string.

TypeScript now automatically discovers this declaration file because it sits next to `math-utils.js` and shares the same base name. No configuration changes needed—TypeScript's module resolution finds `.d.ts` files alongside `.js` files by default.

Open `src/app.ts` in your IDE and you'll immediately see the difference. Hover over `calc.add` and TypeScript shows the proper signature: `add(a: number, b: number): CalculationResult`. The parameters are no longer `any`, and you get autocomplete for the return type's properties.

Try to compile the file with the errors still present:

```command
npx tsc
```

```text
[output]
src/app.ts:4:23 - error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.

4 const result = calc.add("5", "10");
                        ~~~

src/app.ts:5:36 - error TS2554: Expected 2 arguments, but got 1.

5 const badResult = calc.multiply(5);
                                     ~


Found 2 errors in the same file, starting at: src/app.ts:4
```

TypeScript now catches both errors at compile time. The declaration file provided the type information needed to validate how you use the JavaScript module, preventing runtime errors before the code ever executes.

## How TypeScript discovers declaration files

TypeScript's module resolution system looks for declaration files automatically when you import from JavaScript files or packages. This discovery happens in a specific order, and understanding it helps you structure projects and troubleshoot type checking issues when working with mixed JavaScript and TypeScript codebases.

When you write `import { Calculator } from "./math-utils.js"`, TypeScript searches for type information in this order:

1. **Co-located `.d.ts` files** - Looks for `math-utils.d.ts` in the same directory
2. **Package type definitions** - For npm packages, checks `package.json` for a `types` or `typings` field
3. **`@types` packages** - Searches `node_modules/@types` for matching packages
4. **JavaScript inference** - Falls back to basic inference from the JavaScript itself if `allowJs` is enabled

This automatic discovery means declaration files "just work" when placed alongside JavaScript. You don't configure paths or explicitly tell TypeScript where to find types—the module resolution handles it.

Let's verify this behavior by checking what types TypeScript sees:

```typescript
[label src/test.ts]
import { Calculator, formatResult } from "./math-utils.js";

// TypeScript uses the declaration file automatically
const calculator: Calculator = new Calculator();
const result = calculator.add(1, 2);

// The CalculationResult interface from the .d.ts is available
console.log(result.value);
console.log(result.operation);
console.log(result.timestamp);

// Type checking works on function parameters
formatResult(result); // ✓ Correct
formatResult("wrong"); // ✗ Type error
```

Compile to see TypeScript catch the error:

```command
npx tsc
```

```text
[output]
src/test.ts:13:14 - error TS2345: Argument of type 'string' is not assignable to parameter of type 'CalculationResult'.

13 formatResult("wrong");
                ~~~~~~~


Found 1 error in src/test.ts:13
```

TypeScript found the declaration file automatically and applied those types throughout your codebase. Any file that imports from `math-utils.js` gets the type information from `math-utils.d.ts` without additional work.

## Writing declaration files for complex JavaScript

Declaration files can describe sophisticated JavaScript patterns beyond simple functions and classes. When your JavaScript uses advanced features like generics, function overloads, or complex type relationships, declaration files let you express these patterns with full TypeScript precision.

Create a JavaScript file with more complex patterns:

```javascript
[label src/data-store.js]
export class DataStore {
  constructor() {
    this.data = new Map();
  }

  set(key, value) {
    this.data.set(key, value);
  }

  get(key) {
    return this.data.get(key);
  }

  has(key) {
    return this.data.has(key);
  }

  delete(key) {
    return this.data.delete(key);
  }

  clear() {
    this.data.clear();
  }

  get size() {
    return this.data.size;
  }
}

export function createStore(initialData) {
  const store = new DataStore();
  if (initialData) {
    for (const [key, value] of Object.entries(initialData)) {
      store.set(key, value);
    }
  }
  return store;
}
```

Without a declaration file, TypeScript infers very loose types—`get` returns `any`, `set` accepts any key and value types, and there's no relationship between what you store and retrieve.

Create a declaration file with proper generic types:

```typescript
[label src/data-store.d.ts]
export class DataStore<K, V> {
  set(key: K, value: V): void;
  get(key: K): V | undefined;
  has(key: K): boolean;
  delete(key: K): boolean;
  clear(): void;
  get size(): number;
}

export function createStore<T extends Record<string, any>>(
  initialData?: T
): DataStore<keyof T, T[keyof T]>;
```

The declaration file uses generics to create type relationships that JavaScript can't express. The `DataStore<K, V>` generic ensures that whatever key and value types you use remain consistent—if you store numbers with string keys, TypeScript enforces that pattern throughout.

Use the typed store in your code:

```typescript
[label src/use-store.ts]
import { DataStore, createStore } from "./data-store.js";

// Explicit type parameters
const userStore = new DataStore<string, { name: string; age: number }>();
userStore.set("user1", { name: "Alice", age: 30 });
const user = userStore.get("user1");

if (user) {
  console.log(user.name); // TypeScript knows user has name property
}

// Type inference from initial data
const configStore = createStore({
  apiKey: "abc123",
  timeout: 5000,
  debug: true
});

const apiKey = configStore.get("apiKey"); // TypeScript knows this is string | undefined
const timeout = configStore.get("timeout"); // TypeScript knows this is number | undefined

// Type errors are caught
userStore.set("user2", "invalid"); // Error: string is not assignable to user object
configStore.get(123); // Error: number is not assignable to string keys
```

Compile to see the type checking in action:

```command
npx tsc
```

```text
[output]
src/use-store.ts:15:24 - error TS2345: Argument of type 'string' is not assignable to parameter of type '{ name: string; age: number; }'.

15 userStore.set("user2", "invalid");
                          ~~~~~~~~~

src/use-store.ts:16:17 - error TS2345: Argument of type 'number' is not assignable to parameter of type '"apiKey" | "timeout" | "debug"'.

16 configStore.get(123);
                   ~~~


Found 2 errors in the same file, starting at: src/use-store.ts:15
```

The declaration file provided sophisticated type checking for JavaScript that has no native type information. TypeScript tracks generic type parameters, enforces property shapes, and catches type mismatches—all for code that runs as plain JavaScript.

## When declaration files provide the most value

Declaration files solve specific problems where JavaScript code needs type information without requiring a rewrite to TypeScript. The decision to invest in writing declarations depends on how much the code is used, how complex its API is, and whether type safety provides meaningful protection against bugs.

Here are situations where declaration files provide clear benefits.

### Legacy JavaScript codebases

When maintaining established JavaScript projects that aren't ready for full TypeScript conversion, declaration files let you incrementally add type safety:

* **Public APIs get type checking** without modifying working JavaScript implementations.
* **New TypeScript code interoperates safely** with existing JavaScript modules.
* **Refactoring becomes less risky** because TypeScript catches breaking changes at compile time.

You preserve the JavaScript that's been running in production while gaining TypeScript's safety for new development and cross-module interactions.

### JavaScript libraries and utilities

Shared utility modules used across multiple projects benefit from declaration files even if the implementation stays in JavaScript:

* **Consumers get IDE autocomplete** showing available functions and their signatures.
* **API contracts become explicit** through typed interfaces that document expected inputs and outputs.
* **Breaking changes surface immediately** when upgrading the library breaks type compatibility.

The declaration file acts as both documentation and enforcement for how the JavaScript should be used.

### Third-party code without types

When working with npm packages or vendor scripts that lack TypeScript definitions, writing custom declaration files adds type safety:

* **`@types` packages may not exist** for niche or internal libraries.
* **Type definitions may be outdated** compared to the JavaScript you're actually using.
* **Custom modifications need custom types** when you've patched or extended third-party code.

A declaration file in your project's `src` directory provides types without waiting for upstream support:

```typescript
[label src/external-lib.d.ts]
declare module "untyped-library" {
  export function doSomething(param: string): Promise<number>;
  export class Helper {
    constructor(config: { timeout: number });
    execute(): void;
  }
}
```

TypeScript treats this as the source of truth for the module's types, enabling safe usage throughout your codebase.

### JavaScript with complex patterns

JavaScript code using advanced patterns—closures, higher-order functions, builder patterns—benefits from explicit type declarations:

* **Generic relationships are expressible** through declaration file syntax even when JavaScript has no generics.
* **Function overloads document multiple signatures** for functions that behave differently based on arguments.
* **Type guards and discriminated unions** can be declared even for JavaScript that uses duck typing.

The declaration file captures patterns that are impossible to type-check through inference alone:

```json
[label tsconfig.json]
{
  "compilerOptions": {
    "module": "nodenext",
    "target": "esnext",
[highlight]
    "allowJs": true,
    "checkJs": true,
[/highlight]
    "declaration": true,
    "strict": true,
    "verbatimModuleSyntax": true,
    "skipLibCheck": true
  }
}
```

With `allowJs` and `checkJs` enabled alongside custom declaration files, TypeScript type-checks both your TypeScript and JavaScript files using the explicit types you've provided.

## Final thoughts

Ultimately, declaration files serve as a bridge between JavaScript's flexibility and TypeScript's safety. **With them in place, you gain compile-time type checking, IDE support, and documentation for JavaScript code without rewriting anything**. 

When you're ready to fully convert JavaScript to TypeScript, the declaration files you've written document the existing API and make the migration incremental—you can verify that the TypeScript implementation matches the declared types before removing the `.d.ts` file entirely.