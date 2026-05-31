# Understanding TypeScript’s Target Compiler Option

The `target` compiler option determines which version of JavaScript TypeScript produces from your code, directly shaping whether your compiled output runs on older browsers or takes advantage of modern language features. This setting controls how TypeScript transforms syntax like async/await, classes, and arrow functions into equivalent JavaScript that your target runtime can execute. Available since TypeScript's earliest versions, **the target option bridges the gap between writing modern TypeScript and deploying to environments with varying JavaScript support**, letting you author code using the latest syntax while ensuring compatibility with the browsers and Node.js versions your users actually run.

Rather than manually rewriting modern JavaScript features into older equivalents, you **configure a single compiler option that handles syntax transformation automatically**. This approach prevents compatibility issues before deployment, makes your build process explicit about runtime requirements, and creates code that works reliably across different JavaScript environments.

In this guide, you'll learn how target affects your compiled JavaScript output and runtime compatibility, how to choose appropriate target values for different deployment scenarios, and how to handle situations where target settings interact with polyfills and library types.

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
mkdir ts-target-option && cd ts-target-option
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

This generates a `tsconfig.json` file with TypeScript's recommended defaults. Modern TypeScript configurations now default to `"target": "esnext"` and `"module": "nodenext"`, reflecting the reality that most deployment environments support contemporary JavaScript features. You now have a working environment for exploring how different target values transform your TypeScript code into executable JavaScript.

## Understanding compilation with default target settings

TypeScript transforms your code from TypeScript syntax into JavaScript that runtimes can execute. With the current default configuration setting target to ESNext, TypeScript produces output using the latest finalized JavaScript features while transforming only experimental proposals or TypeScript-specific syntax. This default optimizes for modern environments, assuming your deployment targets support recent ECMAScript standards.

Let's see what TypeScript produces when compiling modern syntax with the default target:

```typescript
[label src/modern-syntax.ts]
class DataProcessor {
  async process(items: string[]): Promise<number> {
    const filtered = items.filter(item => item.length > 0);
    const results = await Promise.all(
      filtered.map(async item => item.toUpperCase())
    );
    return results.length;
  }
}

const processor = new DataProcessor();
const count = await processor.process(["hello", "world", ""]);
console.log(`Processed ${count} items`);
```

Compile this with the default configuration:

```command
npx tsc
```

Examine the generated JavaScript:

```command
cat src/modern-syntax.js
```

The output preserves nearly all the original syntax—classes, async/await, arrow functions, and const declarations all remain unchanged. TypeScript only strips the type annotations, producing JavaScript that closely mirrors your source code. This minimal transformation results in highly readable output that takes full advantage of native runtime features.

Run the compiled output:

```command
npx tsx src/modern-syntax.js
```

```text
[output]
Processed 2 items
```

The code executes successfully on modern Node.js because the compiled JavaScript uses features that Node.js 18+ supports natively. However, this default assumption about your runtime environment creates a hidden dependency—your output requires an environment capable of executing ESNext features, which may not match your actual deployment targets.

## Controlling output through explicit target configuration

Setting `target` explicitly in your TypeScript configuration establishes precise control over JavaScript syntax in your compiled output. TypeScript transforms language features that appeared after your specified ECMAScript version while leaving earlier features intact. This creates predictable compilation where you determine the balance between using modern JavaScript and maintaining compatibility with specific runtime environments.

The target option accepts values corresponding to ECMAScript editions: `ES3`, `ES5`, `ES2015` (equivalent to `ES6`), continuing through `ES2016`, `ES2017`, `ES2018`, `ES2019`, `ES2020`, `ES2021`, `ES2022`, `ES2023`, and `ESNext`. Each setting represents a JavaScript specification version, with TypeScript converting features introduced after that version into functionally equivalent code using only earlier features.


Let's compile identical source code with different target values to observe the transformations:

```json
[label tsconfig.json]
{
  "compilerOptions": {
    "target": "ES5",
    "module": "CommonJS",
    "outDir": "./dist",
    "strict": true
  }
}
```

Compile targeting ES5:

```command
npx tsc
```

```text
[output]
src/modern-syntax.ts:12:15 - error TS1375: 'await' expressions are only allowed at the top level of a file when that file is a module, but this file has no imports or exports. Consider adding an empty 'export {}' to make this file a module.

12 const count = await processor.process(["hello", "world", ""]);
                 ~~~~~

src/modern-syntax.ts:12:15 - error TS1378: Top-level 'await' expressions are only allowed when the 'module' option is set to 'es2022', 'esnext', 'system', 'node16', 'node18', 'node20', 'nodenext', or 'preserve', and the 'target' option is set to 'es2017' or higher.

12 const count = await processor.process(["hello", "world", ""]);
                 ~~~~~

Found 2 errors in the same file, starting at: src/modern-syntax.ts:12
```

TypeScript rejects this configuration because top-level await requires both a target of ES2017 or higher and a module system that supports it. The CommonJS module system doesn't support top-level await. 

Now adjust the target to reduce transformation:

```json
[label tsconfig.json]
{
  "compilerOptions": {
[highlight]
    "target": "ES2017",
    "module": "nodenext",
[/highlight]
    "outDir": "./dist",
    "strict": true
  }
}
```

Compile targeting ES2017:

```command
npx tsc
```

Examine the ES2017 result:

```command
cat dist/modern-syntax.js
```

The ES2017 output maintains async/await syntax because that feature became part of the ECMAScript standard in 2017. Classes and arrow functions also persist since they entered the specification in ES2015. TypeScript performs minimal transformation, primarily removing type annotations and leaving JavaScript that resembles your original code.

### How target determines syntax transformation

TypeScript applies transformations based on when specific language features became standardized:

- **ES3/ES5**: Converts classes to prototype-based patterns, transforms arrow functions to regular functions, replaces template literals with string concatenation, expands destructuring assignments, and converts async/await to generator-based implementations
- **ES2015**: Retains classes, arrow functions, let/const declarations, template literals, and destructuring; transforms async/await, generators, and later features
- **ES2017**: Preserves async/await syntax; transforms only language features standardized in ES2018 and beyond
- **ES2020+**: Maintains nearly all contemporary syntax, transforming only features from subsequent specifications or stage 3 proposals

These transformations occur entirely during compilation. TypeScript analyzes JavaScript syntax in your code and applies mechanical rewrites that preserve runtime behavior while restricting output to language features from your target version. The type system doesn't participate in these transformations—they operate exclusively on JavaScript syntax structures.

Crucially, target doesn't provide polyfills for missing runtime APIs. When you call `Array.prototype.flat()` (standardized in ES2019) while targeting ES2015, TypeScript won't transform that method invocation or inject a fallback implementation. You'll receive JavaScript that compiles without errors but throws exceptions in environments lacking that API method.



## Selecting target for specific deployment environments

Your target selection depends on which JavaScript runtimes must execute your compiled code. Contemporary browsers support ES2020 and beyond, recent Node.js releases handle ES2022 features, and legacy environments may require ES5 compatibility. The choice balances runtime compatibility requirements against compiled output size and code readability.

Let's explore how target selection affects practical code:

```typescript
[label src/api-client.ts]
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async fetchUser(id: number): Promise<{name: string; email: string} | null> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${id}`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error(`Failed to fetch user: ${error}`);
      return null;
    }
  }

  async batchFetch(ids: number[]): Promise<Array<{name: string; email: string}>> {
    const results = await Promise.all(
      ids.map(id => this.fetchUser(id))
    );
    return results.filter((user): user is {name: string; email: string} => user !== null);
  }
}

export { ApiClient };
```

For browser applications supporting only contemporary browsers (recent versions of Chrome, Firefox, Safari, Edge), use ES2020 or higher:

```json
[label tsconfig.json]
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "nodenext",
    "lib": ["ES2020", "DOM"],
    "outDir": "./dist",
    "strict": true
  }
}
```

Compile for contemporary browsers:

```command
npx tsc
```

View the compiled output:

```command
cat dist/api-client.js
```

The result preserves async/await, class syntax, optional chaining, and nullish coalescing with minimal changes. This produces compact output and maintains code readability in the compiled JavaScript.

## Final thoughts

**The target option transforms JavaScript compatibility from a runtime concern into a build configuration decision**. You establish clear requirements for which JavaScript features your compiled output uses, allowing TypeScript to handle syntax transformation automatically. Starting from your deployment requirements and selecting an appropriate target creates predictable compilation without runtime surprises.

In practice, target settings turn version compatibility into a configuration choice you make once and adjust as environments evolve. **You write TypeScript using contemporary syntax and let the compiler generate appropriate JavaScript for each target**, producing code that remains maintainable for developers and compatible for users. As browser and Node.js versions advance, increasing target values reduces output size while maintaining identical source code.

If you want to explore these concepts further, you can examine the [TypeScript compiler options reference](https://www.typescriptlang.org/tsconfig#target), which documents all available target values and explains how they interact with other compiler settings to shape your build output.