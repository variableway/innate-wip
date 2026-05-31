# Understanding the verbatimModuleSyntax Option in TypeScript

The `verbatimModuleSyntax` compiler option controls how TypeScript handles import and export statements during compilation, fundamentally changing how you write module code. When enabled, TypeScript enforces a strict one-to-one correspondence between your source imports/exports and the emitted JavaScript, requiring you to use explicit `type` modifiers for type-only imports. This option eliminates ambiguity in module syntax and prevents subtle runtime errors. **The verbatimModuleSyntax option makes your module intentions explicit and predictable**, ensuring that what you write in TypeScript directly translates to JavaScript without unexpected transformations or omissions.

Instead of relying on TypeScript's heuristics to determine which imports are type-only and which are value imports, you **enable verbatimModuleSyntax to make these distinctions explicit in your code**. This approach prevents situations where TypeScript might incorrectly elide an import you need at runtime, or include an import that causes side effects you didn't intend. Your module code becomes more explicit and the compilation output becomes predictable.

In this guide, you'll learn what verbatimModuleSyntax enforces and why it prevents common module errors, how enabling it changes import/export patterns and compilation behavior, and when this strictness improves code reliability over the default behavior.

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
mkdir ts-verbatim && cd ts-verbatim
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

This generates a `tsconfig.json` file with TypeScript's default settings. Modern TypeScript includes `"verbatimModuleSyntax": true` in the default configuration, recognizing its value for module clarity. You now have a working environment for exploring how verbatimModuleSyntax affects import/export handling and compilation output.

## Understanding import handling without verbatimModuleSyntax

TypeScript traditionally uses sophisticated heuristics to determine whether imports are used as types or values during compilation. When an import appears to reference only types, TypeScript elides (removes) it from the emitted JavaScript since types don't exist at runtime. This automatic behavior seems convenient but creates ambiguity: you can't tell from looking at the import statement alone whether it will survive compilation or disappear.

Let's create files that demonstrate TypeScript's default import handling:

```typescript
[label src/types.ts]
export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Product {
  id: number;
  title: string;
  price: number;
}

export const API_VERSION = "v1";

export function validateEmail(email: string): boolean {
  return email.includes("@");
}
```

```typescript
[label src/service.ts]
import { User, Product, API_VERSION, validateEmail } from "./types.js";

export class UserService {
  getUser(id: number): User {
    return {
      id,
      name: "John Doe",
      email: "john@example.com"
    };
  }

  validateUserEmail(user: User): boolean {
    return validateEmail(user.email);
  }
}

export class ProductService {
  getProduct(id: number): Product {
    return {
      id,
      title: "Sample Product",
      price: 99.99
    };
  }

  getApiVersion(): string {
    return API_VERSION;
  }
}
```

Configure TypeScript with verbatimModuleSyntax disabled:

```json
[label tsconfig.json]
{
  "compilerOptions": {
    "module": "nodenext",
    "target": "esnext",
[highlight]
    "outDir": "./dist",
[/highlight]
    "rootDir": "./src",
    "sourceMap": true,
    "declaration": true,
    "declarationMap": true,
    "strict": true,
    ...
[highlight]
    "verbatimModuleSyntax": false,
[/highlight]
    "isolatedModules": true,
    "noUncheckedSideEffectImports": true,
    "moduleDetection": "force",
    "skipLibCheck": true
  }
}
```

Compile the project:

```command
npx tsc
```

Examine the emitted JavaScript:

```command
cat dist/service.js
```

```javascript
[output];
import { API_VERSION, validateEmail } from "./types.js";
export class UserService {
  getUser(id) {
    return {
      id,
      name: "John Doe",
      email: "john@example.com",
    };
  }
  validateUserEmail(user) {
    return validateEmail(user.email);
  }
}
export class ProductService {
  getProduct(id) {
    return {
      id,
      title: "Sample Product",
      price: 99.99,
    };
  }
  getApiVersion() {
    return API_VERSION;
  }
}
```

TypeScript automatically removed the `User` and `Product` imports from the compiled output because they're only used as type annotations. The import statement changed from importing four things to importing only two. This elision happens silently based on TypeScript's analysis of how you use each import.

This automatic behavior creates several problems:

- **Unpredictable output** - You can't tell which imports will survive compilation without analyzing their usage.
- **Side effect risk** - Imports that exist for side effects might be removed if they appear unused.
- **Refactoring hazards** - Changing how you use an import can inadvertently change whether it's emitted.

## Enabling verbatimModuleSyntax for explicit imports

Enabling verbatimModuleSyntax changes TypeScript's behavior fundamentally: imports and exports are emitted exactly as written, with no elision or transformation. This means TypeScript no longer analyzes usage patterns to decide what to remove. Instead, you must explicitly mark type-only imports with the `type` keyword, creating a clear distinction between imports that affect runtime and those that exist purely for type checking.

Enable verbatimModuleSyntax in your configuration:

```json
[label tsconfig.json]
{
  "compilerOptions": {
    "module": "nodenext",
    "target": "esnext",
    "outDir": "./dist",
    "rootDir": "./src",
    "sourceMap": true,
    "declaration": true,
    "declarationMap": true,
    "strict": true,
[highlight]
    "verbatimModuleSyntax": true,
[/highlight]
    "skipLibCheck": true
  }
}
```

Try to compile:

```command
npx tsc
```

```text
[output]
src/service.ts:1:10 - error TS1484: 'User' is a type and must be imported using a type-only import when 'verbatimModuleSyntax' is enabled.

1 import { User, Product, API_VERSION, validateEmail } from "./types.js";
           ~~~~

src/service.ts:1:16 - error TS1484: 'Product' is a type and must be imported using a type-only import when 'verbatimModuleSyntax' is enabled.

1 import { User, Product, API_VERSION, validateEmail } from "./types.js";
                 ~~~~~~~


Found 2 errors in the same file, starting at: src/service.ts:1
```

TypeScript now requires you to explicitly distinguish type imports from value imports. Since `User` and `Product` are interfaces (types), they must use type-only import syntax.

Fix the imports by separating types from values:

```typescript
[label src/service.ts]
[highlight]
import type { User, Product } from "./types.js";
import { API_VERSION, validateEmail } from "./types.js";
[/highlight]

export class UserService {
  getUser(id: number): User {
    return {
      id,
      name: "John Doe",
      email: "john@example.com"
    };
  }

  validateUserEmail(user: User): boolean {
    return validateEmail(user.email);
  }
}

export class ProductService {
  getProduct(id: number): Product {
    return {
      id,
      title: "Sample Product",
      price: 99.99
    };
  }

  getApiVersion(): string {
    return API_VERSION;
  }
}
```

Compile again:

```command
npx tsc
```

Examine the emitted JavaScript:

```command
cat dist/service.js
```

```javascript
[output];
import { API_VERSION, validateEmail } from "./types.js";
export class UserService {
  getUser(id) {
    return {
      id,
      name: "John Doe",
      email: "john@example.com",
    };
  }
  validateUserEmail(user) {
    return validateEmail(user.email);
  }
}
export class ProductService {
  getProduct(id) {
    return {
      id,
      title: "Sample Product",
      price: 99.99,
    };
  }
  getApiVersion() {
    return API_VERSION;
  }
}
```

The output matches what you had before, but now the distinction between type and value imports is explicit in your source code. The `import type` statement completely disappears from the JavaScript, while the value import remains unchanged. Anyone reading your TypeScript can immediately see which imports exist for types and which provide runtime values.

## How verbatimModuleSyntax prevents side effect issues

Beyond making imports explicit, verbatimModuleSyntax prevents a subtle but serious problem: accidentally removing imports that exist for their side effects. Some modules perform initialization when imported, and TypeScript's automatic elision can remove these imports if they don't appear to be used, breaking your application in ways that only surface at runtime.

To see this protection in action, you'll create a module with side effects and observe how different approaches handle it.

### Creating a module with side effects

Create a module that registers something globally when imported:

```typescript
[label src/logger.ts]
export interface LogLevel {
  level: "info" | "warn" | "error";
  timestamp: Date;
  message: string;
}

// Side effect: register global error handler
globalThis.addEventListener?.("error", (event) => {
  console.error("[Global Error Handler]", event.message);
});

export function log(level: LogLevel["level"], message: string): void {
  const logEntry: LogLevel = {
    level,
    timestamp: new Date(),
    message
  };
  console.log(`[${logEntry.level.toUpperCase()}] ${logEntry.message}`);
}
```

Create a file that imports this module:

```typescript
[label src/app.ts]
import { LogLevel } from "./logger.js";

export function processData(): void {
  const entry: LogLevel = {
    level: "info",
    timestamp: new Date(),
    message: "Processing data"
  };
  console.log("Processing:", entry.message);
}

processData();
```

With verbatimModuleSyntax disabled, compile and check the output:

```json
[label tsconfig.json]
{
  "compilerOptions": {
    "module": "nodenext",
    "target": "esnext",
    "outDir": "./dist",
    "rootDir": "./src",
[highlight]
    "verbatimModuleSyntax": false,
[/highlight]
    "strict": true,
    "skipLibCheck": true
  }
}
```

```command
npx tsc
```

```command
cat dist/app.js
```

```javascript
[output];
export function processData() {
  const entry = {
    level: "info",
    timestamp: new Date(),
    message: "Processing data",
  };
  console.log("Processing:", entry.message);
}
processData();
```

The import disappeared completely. TypeScript determined that `LogLevel` is only used as a type, so it removed the entire import statement. The side effect of registering the global error handler never executes because the module is never imported at runtime.

### verbatimModuleSyntax forces explicit intent

Enable verbatimModuleSyntax and try to compile:

```json
[label tsconfig.json]
{
  "compilerOptions": {
    "module": "nodenext",
    "target": "esnext",
    "outDir": "./dist",
    "rootDir": "./src",
[highlight]
    "verbatimModuleSyntax": true,
[/highlight]
    "strict": true,
    "skipLibCheck": true
  }
}
```

```command
npx tsc
```

```text
[output]
src/app.ts:1:10 - error TS1484: 'LogLevel' is a type and must be imported using a type-only import when 'verbatimModuleSyntax' is enabled.

1 import { LogLevel } from "./logger.js";
           ~~~~~~~~


Found 1 error in src/app.ts:1
```

TypeScript forces you to be explicit. You have two options:

**Option 1**: Use a type-only import if you don't need the side effects:

```typescript
[label src/app.ts]
[highlight]
import type { LogLevel } from "./logger.js";
[/highlight]

export function processData(): void {
  const entry: LogLevel = {
    level: "info",
    timestamp: new Date(),
    message: "Processing data"
  };
  console.log("Processing:", entry.message);
}

processData();
```

**Option 2**: Keep a value import to preserve side effects:

```typescript
[label src/app.ts]
[highlight]
import type { LogLevel } from "./logger.js";
import "./logger.js";
[/highlight]

export function processData(): void {
  const entry: LogLevel = {
    level: "info",
    timestamp: new Date(),
    message: "Processing data"
  };
  console.log("Processing:", entry.message);
}

processData();
```

The second approach explicitly imports the module for its side effects while separately importing the type. This makes your intentions completely clear: the type import exists for type checking, while the bare import ensures the module executes.

Compile with the second approach:

```command
npx tsc
```

```command
cat dist/app.js
```

```javascript
[output];
import "./logger.js";
export function processData() {
  const entry = {
    level: "info",
    timestamp: new Date(),
    message: "Processing data",
  };
  console.log("Processing:", entry.message);
}
processData();
```

The side effect import remains in the output, guaranteeing that the logger module executes and registers the global error handler. verbatimModuleSyntax prevented TypeScript from silently removing an import that affects runtime behavior.

## When verbatimModuleSyntax should be enabled

verbatimModuleSyntax trades convenience for predictability and safety. The decision to enable it depends on your project's complexity, team size, and tolerance for subtle import-related bugs.

Here are situations where enabling verbatimModuleSyntax provides clear benefits.

### Projects with complex module graphs

Large codebases with many interdependent modules benefit from explicit import intentions. When dozens of files import from shared utility modules:

- **Refactoring becomes safer** because changing how you use an import doesn't silently change whether it's emitted.
- **Code review is easier** since reviewers can see exactly which imports affect runtime without analyzing usage patterns.
- **Module bundlers behave predictably** because they receive explicit import statements that match your intentions.

The explicitness helps prevent situations where a seemingly innocuous change accidentally removes a critical import.

### Teams using module side effects

If your codebase relies on modules that perform initialization, register plugins, or modify globals when imported, verbatimModuleSyntax prevents accidental removal:

- **Polyfill imports stay intact** when you explicitly import them for side effects.
- **Plugin registration modules** don't disappear if you also import types from them.
- **CSS-in-JS or other runtime-dependent imports** remain in output when needed.

The forced distinction between type imports and value imports makes side effect dependencies visible and protected.

### Projects targeting multiple module systems

When compiling TypeScript to different module formats (CommonJS, ES modules, AMD), verbatimModuleSyntax ensures consistent behavior across all targets:

- **CommonJS output matches ES module output** in terms of which imports survive compilation.
- **No surprises when switching targets** because import elision doesn't vary by module system.
- **Bundler compatibility improves** since all module formats have explicit import statements.

This consistency matters when maintaining libraries that ship multiple module formats or when migrating between module systems.

### Codebases prioritizing explicitness

Teams that value explicit code over implicit behavior naturally prefer verbatimModuleSyntax. The same reasoning that leads teams to enable strict TypeScript settings applies here:

- **Self-documenting code** where import statements clearly indicate their purpose.
- **Reduced cognitive load** since developers don't need to mentally track TypeScript's elision heuristics.
- **Better IDE support** as tooling can provide more accurate suggestions based on explicit import types.

The additional verbosity of separating type imports from value imports becomes worthwhile when it prevents bugs and improves code clarity:

```json
[label tsconfig.json]
{
  "compilerOptions": {
    "module": "nodenext",
    "target": "esnext",
    "strict": true,
[highlight]
    "verbatimModuleSyntax": true,
[/highlight]
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "skipLibCheck": true
  }
}
```

Here, verbatimModuleSyntax fits naturally alongside other strict options that catch potential issues at compile time rather than runtime.

### When avoiding import ambiguity matters

In scenarios where import statements might be ambiguous without careful inspection, verbatimModuleSyntax eliminates guesswork:

- **Large imports with mixed types and values** become explicitly separated rather than relying on position in the import list.
- **Re-exports in barrel files** behave predictably since the distinction between type and value re-exports is explicit.
- **Dynamic import considerations** become clearer when you can see which imports are purely compile-time concerns.

The clarity helps both humans and tools understand module relationships accurately.

## Final thoughts

Ultimately, `verbatimModuleSyntax` is a precision tool that eliminates ambiguity from your module code. **With it enabled, every import and export statement in your source code maps directly to the JavaScript output with no hidden transformations or clever elisions**. When rapid prototyping matters more than strict module semantics, or when working with simpler codebases where import elision rarely causes issues, you can disable verbatimModuleSyntax and rely on TypeScript's automatic behavior. The choice comes down to whether you value predictability and explicitness over the convenience of automatic import handling.
