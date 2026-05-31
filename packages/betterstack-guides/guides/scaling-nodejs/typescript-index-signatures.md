# Index Signatures in TypeScript: Type-Safe Dynamic Objects

**Index signatures let you type dynamic object properties safely.** They describe objects whose keys you don’t know at compile time, while still enforcing the structure and types of the values you access with bracket notation.

JavaScript objects often act as dictionaries or maps, where keys come from user input, API responses, or runtime computations. In these cases, explicitly declaring every possible property quickly becomes impractical in TypeScript.

**They define the allowed key and value types without listing every property.** This keeps dynamic data structures type-safe while preserving TypeScript’s compile-time guarantees about the values you read and write.

This approach lets you model evolving or open-ended objects that are still strongly constrained, making it easier to work with real-world data that changes over time.

In this guide, you’ll learn how to use index signatures to build flexible, well-typed data structures. You’ll see how type-safe dynamic access works, how string, number, and symbol index signatures differ, and how to combine them with known properties under proper type constraints.

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
mkdir ts-index-signatures && cd ts-index-signatures
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

This initializes a `tsconfig.json` file, establishing a modern TypeScript environment. With these steps complete, you have everything needed to explore index signatures with immediate code execution through `tsx`.

## Understanding the dynamic property problem

TypeScript enforces strict property access by default, requiring you to declare every property that might exist on an object. This works well for fixed data structures but breaks down when property names are dynamic—configuration objects, API response caches, internationalization dictionaries, and user-generated data all require flexible property access.

Without proper typing, these dynamic objects force you to use `any`, losing all type safety for property values. You can't catch typos in property names, can't verify value types, and can't get autocomplete for operations on those values.

Let's examine a typical scenario where dynamic properties cause type errors:

```typescript
[label src/problem.ts]
interface UserCache {
  // How do we type dynamic user IDs?
}

const cache: UserCache = {};

function cacheUser(userId: string, name: string) {
  cache[userId] = name;  // Error: no index signature
}

function getUser(userId: string): string {
  return cache[userId];  // Error: no index signature
}

cacheUser("user_123", "Alice");
cacheUser("user_456", "Bob");

console.log(getUser("user_123"));
console.log(getUser("user_456"));
```

Check what TypeScript reports:

```command
npx tsc --noEmit src/problem.ts
```

```text
[output]
src/problem.ts:8:3 - error TS7053: Element implicitly has an 'any' type because expression of type 'string' can't be used to index type 'UserCache'.
  No index signature with a parameter of type 'string' was found on type 'UserCache'.

8   cache[userId] = name; // Error: no index signature
    ~~~~~~~~~~~~~

src/problem.ts:12:10 - error TS7053: Element implicitly has an 'any' type because expression of type 'string' can't be used to index type 'UserCache'.
  No index signature with a parameter of type 'string' was found on type 'UserCache'.

12   return cache[userId]; // Error: no index signature
            ~~~~~~~~~~~~~


Found 2 errors in the same file, starting at: src/problem.ts:8
```

TypeScript rejects bracket notation property access because `UserCache` has no index signature. The compiler can't verify what type of value you'll get back or whether setting properties is safe, so it blocks the operation entirely.

The common workaround of using `any` destroys type safety completely:

```typescript
const cache: any = {};  // Now everything compiles but nothing is safe
```

This approach compiles successfully but provides no protection against bugs. You lose autocomplete, can't catch value type errors, and essentially disable TypeScript for this object.

## Solving the problem with index signatures

Index signatures declare the types for dynamic properties, specifying what kind of keys an object accepts and what type of values those keys map to. The syntax `[key: string]: ValueType` tells TypeScript that any string key returns a value of `ValueType`.

However, index signatures in TypeScript don't guarantee that a property exists—they only define the type when it does exist. Accessing a property that was never set returns `undefined`, so TypeScript types the return value as `ValueType | undefined` when strict null checks are enabled.

Let's fix the previous example with an index signature:

```typescript
[label src/problem.ts]
interface UserCache {
  [highlight]
  [userId: string]: string;
  [/highlight]
}

const cache: UserCache = {};

function cacheUser(userId: string, name: string) {
  cache[userId] = name;
}

[highlight]
function getUser(userId: string):string | undefined {
[/highlight]
  return cache[userId];
}

...
```

Verify TypeScript accepts this:

```command
npx tsc --noEmit 
```

TypeScript compiles successfully now. The index signature `[userId: string]: string` tells the compiler that any string key returns a string value when it exists, but the function signature acknowledges that accessing a non-existent key returns `undefined`.

Run the code to verify it works:

```command
npx tsx src/problem.ts
```

```text
[output]
Alice
Bob
```

The index signature enables dynamic property access while TypeScript enforces that all stored values are strings. The function return type `string | undefined` accurately represents what happens when you access properties that might not exist in the cache.

If you want to handle the undefined case explicitly, you can add a default value:

```typescript
function getUser(userId: string): string {
  return cache[userId] ?? "Unknown user";
}
```

This uses the nullish coalescing operator to provide a fallback when the user ID isn't in the cache, allowing the function to return a guaranteed string.

### How index signature types work

Index signatures create a mapping from key types to value types that applies to all properties accessed through bracket notation. When you write `[key: string]: number`, TypeScript interprets every bracket access like `obj[someKey]` as potentially returning a `number | undefined`.

The parameter name `key` is just a label—it could be anything. TypeScript only cares about the key type and value type. The signature `[userId: string]: string` and `[id: string]: string` are identical in TypeScript's type system.

TypeScript enforces the value type for writes but adds `undefined` for reads when strict null checks are enabled. This reflects JavaScript's reality where accessing non-existent properties returns `undefined`. Attempting to assign a value that doesn't match the signature's value type produces a compile error.

This compile-time enforcement happens with zero runtime overhead. The generated JavaScript contains standard property access with no validation logic. Index signatures exist purely for type checking during development.
## Combining index signatures with known properties

Index signatures work alongside explicit property declarations, enabling objects that have both required fields and dynamic properties. This pattern appears frequently in API responses, configuration objects, and data structures that extend base types with arbitrary metadata.

The critical constraint is that known properties must be compatible with the index signature. If your index signature declares `[key: string]: number`, all explicitly declared properties must also have `number` as their type. TypeScript enforces this to maintain consistency across all property access patterns.

Let's build a configuration object with required fields and dynamic settings:

```typescript
[label src/mixed.ts]
interface AppConfig {
  version: string;
  debug: boolean;
  [setting: string]: string | boolean;
}

const config: AppConfig = {
  version: "1.0.0",
  debug: true,
  theme: "dark",
  apiTimeout: "5000"
};

function getSetting(key: string): string | boolean {
  return config[key];
}

console.log("Version:", config.version);
console.log("Theme:", getSetting("theme"));
console.log("Debug:", config.debug);
```

Check TypeScript's validation:

```command
npx tsc --noEmit
```

TypeScript compiles successfully because the known properties `version` and `debug` have types that are compatible with the index signature `string | boolean`. The signature allows any string key to return either a string or boolean value, which covers both explicit and dynamic properties.

Run the code:

```command
npx tsx src/mixed.ts
```

```text
[output]
Version: 1.0.0
Theme: dark
Debug: true
```

Attempting to add an incompatible property type fails at compile time:

```typescript
[label src/mixed.ts]
interface AppConfig {
  version: string;
  debug: boolean;
[highlight]
  port: number;  // Error: number not compatible with string | boolean
[/highlight]
  [setting: string]: string | boolean;
}
...
```

TypeScript rejects this because `port: number` violates the index signature constraint:

```text
[output]
src/mixed.ts:4:3 - error TS2411: Property 'port' of type 'number' is not assignable to 'string' index type 'string | boolean'.

4   port: number; // Error: number not compatible with string | boolean
    ~~~~

src/mixed.ts:9:7 - error TS2741: Property 'port' is missing in type '{ version: string; debug: true; theme: string; apiTimeout: string; }' but required in type 'AppConfig'.

9 const config: AppConfig = {
        ~~~~~~

  src/mixed.ts:4:3
    4   port: number; // Error: number not compatible with string | boolean
        ~~~~
    'port' is declared here.


Found 2 errors in the same file, starting at: src/mixed.ts:4
```


Every property, whether explicit or dynamic, must conform to the signature's value type.

## Understanding string vs number index signatures

TypeScript supports two types of index signatures: string keys and number keys. This distinction mirrors JavaScript's behavior where numeric properties are treated specially but ultimately converted to strings.

String index signatures accept any string as a key, including numeric strings. Number index signatures specifically type array-like objects where indices are numbers, but JavaScript's property access rules mean these numeric keys also work as strings.

The critical rule is that number-indexed properties must be compatible with string-indexed properties when both exist. This reflects JavaScript's reality where `obj[0]` and `obj["0"]` access the same property.

Let's examine how different index signatures work:

```typescript
[label src/keys.ts]
// String index signature
interface StringDict {
  [key: string]: number;
}

const scores: StringDict = {
  alice: 95,
  bob: 87,
  "123": 100  // Numeric string keys are fine
};

// Number index signature for array-like objects
interface NumberArray {
  [index: number]: string;
}

const items: NumberArray = {
  0: "first",
  1: "second",
  2: "third"
};

console.log("Alice's score:", scores.alice);
console.log("Numeric key:", scores["123"]);
console.log("First item:", items[0]);
console.log("Second item:", items[1]);
```

Run this to see both signature types in action:

```command
npx tsx src/keys.ts
```

```text
[output]
Alice's score: 95
Numeric key: 100
First item: first
Second item: second
```

Number index signatures make most sense for array-like structures where you're simulating arrays or tuples. For general dictionaries and maps, string index signatures provide more flexibility.

When you combine both signatures, the number signature's value type must be assignable to the string signature's value type:

```typescript
interface MixedIndex {
  [key: string]: string | number;
  [index: number]: number;  // number is assignable to string | number
}
```

This compiles because `number` is a valid subtype of `string | number`. Reversing the constraint fails:

```typescript
interface InvalidMixed {
  [key: string]: number;
  [index: number]: string;  // Error: string not assignable to number
}
```


## Final thoughts

**Index signatures enable type-safe access to dynamic object properties.** They bridge the gap between TypeScript’s strict type system and JavaScript’s flexible object model by allowing property names that are only known at runtime, while still enforcing well-defined types for their values at compile time.

When you combine index signatures with explicitly declared fields, you get objects that are both structured and extensible. The known properties guarantee a stable shape for critical data, while the index signature leaves room for additional keys that can be added as your needs evolve, from simple caches to rich configuration objects.

**Hybrid types combine fixed fields with flexible, dynamic properties.** This pattern scales cleanly as your codebase grows, letting you layer new options and behaviors onto existing structures without losing the safety net of TypeScript’s static checking.

Index signatures themselves are purely a compile-time feature. **Index signatures add flexibility without adding runtime overhead.** Under the hood, they compile to plain JavaScript property access, which makes them safe to use in performance-sensitive parts of an application. To go further, you can explore the official [TypeScript handbook](https://www.typescriptlang.org/docs/handbook/2/objects.html#index-signatures) and learn how advanced patterns, such as mapped types, build on index signatures to model even more powerful dynamic object types.
