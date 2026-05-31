# Understanding readonly in TypeScript

The `readonly` modifier in TypeScript stops unwanted changes to your data by marking properties and array items as unchangeable during compile time. **This gives you strong guarantees about data stability without slowing down your code.** You get safety without using heavy immutability libraries or making extra copies at runtime.

JavaScript offers `Object.freeze()` and `const`, but both have limits. `const` only stops reassignment, not mutation. `Object.freeze()` works at runtime and only protects the top level of an object. **TypeScript's `readonly` closes this gap by enforcing immutability while you write your code.** It catches mutation mistakes early so they never reach production.

In this guide, you'll learn:

- How `readonly` prevents property mutations at compile time
- The difference between `readonly` and JavaScript's immutability features
- Building type-safe immutable data structures with readonly arrays and tuples
- When to use `readonly` versus runtime immutability solutions

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

Create and configure a new TypeScript project with ES module support:

```command
mkdir ts-readonly && cd ts-readonly
```

Initialize with ES modules:

```command
npm init -y && npm pkg set type="module"
```

Install dependencies:

```command
npm install -D typescript @types/node tsx
```

Next, create a TypeScript configuration file:

```command
npx tsc --init
```

This initializes a `tsconfig.json` file, establishing a modern TypeScript environment. With these steps complete, you have everything needed to explore `readonly` modifiers with immediate code execution through `tsx`.

## Understanding the mutation problem

Production applications frequently pass objects between functions, components, and modules where unexpected mutations create hard-to-trace bugs. A function that modifies its input parameter breaks the expectations of calling code, leading to state corruption that only manifests later in execution.

These bugs are particularly insidious because the mutation site and the failure point are often separated by many function calls. By the time you notice something's wrong, the trail back to the actual mutation has gone cold.

Let's examine a typical scenario where unintended mutations cause production issues:

```typescript
[label src/mutation.ts]
interface UserConfig {
  theme: string;
  notifications: boolean;
}

function applyTheme(config: UserConfig) {
  config.theme = "dark";  // Accidental mutation
  return config;
}

const userConfig: UserConfig = {
  theme: "light",
  notifications: true
};

console.log("Before:", userConfig.theme);
applyTheme(userConfig);
console.log("After:", userConfig.theme);  // Unexpectedly changed!
```

Run this code to see the mutation in action:

```command
npx tsx src/mutation.ts
```

```text
[output]
Before: light
After: dark
```

The `applyTheme` function silently mutates the input object. The calling code expected `userConfig` to remain unchanged, but it didn't—and TypeScript provided no warning.

Check whether TypeScript catches this problem:

```command
npx tsc --noEmit src/mutation.ts
```

TypeScript compiles successfully without errors. The type system sees `UserConfig` as fully mutable, so modifying properties inside `applyTheme` is perfectly valid according to the type checker. This mutation will reach production where it causes subtle bugs in components that expected the original configuration to remain stable.

## Solving mutations with readonly properties

The `readonly` modifier transforms mutable properties into compile-time constants that TypeScript refuses to modify. By adding `readonly` to property declarations, you create an explicit contract that this data cannot change after initialization.

This shifts mutation detection from runtime debugging to compile-time type checking. TypeScript analyzes your code before execution and rejects any attempt to modify readonly properties, preventing entire categories of bugs from ever reaching production.

Let's fix the previous example by making the configuration immutable:

```typescript
[label src/mutation.ts]
interface UserConfig {
[highlight]
  readonly theme: string;
  readonly notifications: boolean;
[/highlight]
}

function applyTheme(config: UserConfig) {
  config.theme = "dark";  // Accidental mutation
  return config;
}
...
```

Now check what TypeScript reports:

```command
npx tsc --noEmit src/mutation.ts
```

```text
[output]
src/mutation.ts:7:10 - error TS2540: Cannot assign to 'theme' because it is a read-only property.

7   config.theme = "dark"; // Accidental mutation
           ~~~~~


Found 1 error in src/mutation.ts:7
```

TypeScript now catches the mutation attempt during compilation. The error appears in your editor as you type, providing immediate feedback that you're violating the immutability contract.

### How readonly enforcement works

TypeScript enforces `readonly` through structural type checking during compilation. When you mark a property as `readonly`, TypeScript modifies the property's type signature to exclude mutation operations. This happens entirely at the type level—the generated JavaScript contains no immutability enforcement.

For the `theme` property, TypeScript changes the type from a mutable string property to a readonly string property. Any code attempting assignment triggers a type error because the readonly version structurally lacks a setter. The property remains accessible for reading but becomes incompatible with mutation operations.

This compile-time approach provides zero runtime overhead. The generated JavaScript code contains regular property assignments—`readonly` exists only during type checking to prevent mutations before the code executes.

## Working with readonly arrays and tuples

Arrays present a unique immutability challenge because they combine reference stability with mutable contents. Marking an array property as `readonly` prevents reassignment, but the array's methods remain available for mutations. TypeScript's `readonly` array type addresses this by removing all mutating methods from the type signature.

The syntax differs from property modifiers. While properties use `readonly propertyName`, arrays require the `ReadonlyArray<T>` utility type or the shorthand `readonly T[]` syntax. Both approaches create arrays where mutation methods are absent from the type system.

Let's build a configuration manager that enforces immutability at every level:

```typescript
[label src/arrays.ts]
interface DatabaseConfig {
  readonly host: string;
  readonly allowedIPs: readonly string[];
}

const dbConfig: DatabaseConfig = {
  host: "localhost",
  allowedIPs: ["192.168.1.1", "192.168.1.2"]
};

// These fail at compile time:
// dbConfig.host = "newhost.com";
// dbConfig.allowedIPs.push("192.168.1.3");
// dbConfig.allowedIPs[0] = "10.0.0.1";

// Reading works fine:
console.log("Host:", dbConfig.host);
console.log("First IP:", dbConfig.allowedIPs[0]);
```

Verify TypeScript's enforcement:

```command
npx tsc --noEmit src/arrays.ts
```

TypeScript compiles successfully because all the mutation attempts are commented out. Uncomment any of them and TypeScript immediately flags the violation. The `readonly` modifier on arrays removes mutation methods entirely from the type system, making it impossible to accidentally modify the array contents.

## Readonly vs const vs Object.freeze

TypeScript's `readonly`, JavaScript's `const`, and `Object.freeze()` all claim to prevent mutations, but they operate at different levels with distinct trade-offs. Understanding when to use each requires knowing what protections they actually provide.

The `const` keyword prevents variable reassignment but has no effect on object properties. You cannot reassign a `const` variable to a different object, but you can freely mutate that object's properties. This makes `const` useful for preventing accidental rebinding but inadequate for protecting data integrity.

`Object.freeze()` operates at runtime and prevents property modifications on the frozen object. However, it only works shallowly—nested objects remain mutable unless you recursively freeze them. Runtime freezing also incurs performance costs and provides no compile-time feedback, meaning mutations only fail during execution.

TypeScript's `readonly` works during compilation and provides deep type-level immutability. When you mark nested objects as `readonly`, TypeScript enforces immutability through the entire object graph. The compiler catches mutations before the code runs, and the generated JavaScript has zero runtime overhead.

Here's how each approach handles the same data:

```typescript
[label src/comparison.ts]
interface Point {
  readonly x: number;
  readonly y: number;
}

// const: prevents reassignment only
const constPoint = { x: 10, y: 20 };
constPoint.x = 30;  // Allowed - properties are mutable

// Object.freeze: runtime immutability
const frozenPoint = Object.freeze({ x: 10, y: 20 });
// frozenPoint.x = 30;  // Fails at runtime in strict mode

// readonly: compile-time immutability
const readonlyPoint: Point = { x: 10, y: 20 };
// readonlyPoint.x = 30;  // Error - compile-time enforcement

console.log("const point:", constPoint);
console.log("frozen point:", frozenPoint);
console.log("readonly point:", readonlyPoint);
```

Run this to see the difference:

```command
npx tsx src/comparison.ts
```

```text
[output]
const point: { x: 30, y: 20 }
frozen point: { x: 10, y: 20 }
readonly point: { x: 10, y: 20 }
```

The `const` variable accepted the mutation because `const` only protects the variable binding. The frozen object remains unchanged because `Object.freeze()` blocks property modifications at runtime. The readonly object also remains unchanged, but TypeScript would have prevented that mutation at compile time rather than waiting for runtime.

For performance-critical applications, `readonly` provides the best trade-off. It gives you compile-time safety guarantees without the runtime cost of freezing objects. You catch bugs during development through type checking rather than discovering them in production through runtime failures.

## Final thoughts

The `readonly` modifier helps prevent accidental changes to data before your code runs. TypeScript warns you during development instead of at runtime. **This stops many data bugs early and keeps your code safer.** It works with both simple properties and complex data structures, and it adds no cost when the program runs.

TypeScript checks everything at compile time, which gives strong guarantees that your data will not change. **Your JavaScript stays fast and your TypeScript stays safe.** This makes `readonly` very useful when you need both good performance and stable data.

Using `readonly` turns normal objects into clear promises that they will not change. **This cuts down on debugging time and removes many types of mutation bugs because mistakes are caught directly in the editor.**

To learn more, you can read the TypeScript handbook’s section on readonly properties:
[https://www.typescriptlang.org/docs/handbook/2/objects.html#readonly-properties](https://www.typescriptlang.org/docs/handbook/2/objects.html#readonly-properties)