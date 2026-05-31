# Rest Parameters and Spread Syntax in TypeScript

Rest parameters and spread syntax in TypeScript let you write flexible functions that accept any number of arguments while staying fully type-safe. They **turn arrays into individual arguments and gather multiple arguments into arrays**, so you can build expressive APIs that still benefit from compile-time checking.

At runtime, JavaScript’s `...` operator behaves the same with or without TypeScript, but TypeScript adds static checks to ensure you only spread and collect values of compatible types. This helps prevent bugs where the wrong number of arguments or incorrect types would otherwise cause runtime errors.

The **rest syntax gathers remaining values into an array, while spread syntax expands an array (or similar structure) into separate values**. TypeScript tracks the types through both operations, keeping things safe whether you’re collecting arguments into a list or passing list items into a function.

In this guide, you’ll see how rest parameters create type-safe variadic functions, how spread works with arrays, objects, and function calls, and how both features combine with tuple types for very precise function signatures.

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
mkdir ts-rest-spread && cd ts-rest-spread
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

This initializes a `tsconfig.json` file, establishing a modern TypeScript environment. With these steps complete, you have everything needed to explore rest parameters and spread syntax with immediate code execution through `tsx`.

## Understanding the variadic function problem

Functions often need to accept variable numbers of arguments—logging utilities that handle any number of messages, mathematical operations on multiple values, or event handlers with varying callback parameters. Without rest parameters, you must either define multiple overloads or use the legacy `arguments` object, neither of which provides good type safety.

The `arguments` object exists in JavaScript but lacks type information and array methods, making it awkward to work with. Function overloads require explicitly declaring every possible argument count, which doesn't scale beyond a few variations.

Let's examine a scenario where variable arguments create type safety problems:

```typescript
[label src/problem.ts]
// Attempt 1: Using arguments object (untyped)
function sum1() {
  let total = 0;
  for (let i = 0; i < arguments.length; i++) {
    total += arguments[i];
  }
  return total;
}

// Attempt 2: Multiple overloads (doesn't scale)
function sum2(a: number): number;
function sum2(a: number, b: number): number;
function sum2(a: number, b: number, c: number): number;
function sum2(...args: number[]): number {
  return args.reduce((sum, n) => sum + n, 0);
}

console.log("Sum1:", sum1(1, 2, 3));
console.log("Sum2:", sum2(1, 2, 3));
```

Check what TypeScript reports:

```command
npx tsc --noEmit src/problem.ts
```

```text
[output]
src/problem.ts:17:27 - error TS2554: Expected 0 arguments, but got 3.

17 console.log("Sum1:", sum1(1, 2, 3));
                             ~~~~~~~


Found 1 error in src/problem.ts:17
```

The `arguments` object fails in TypeScript's strict mode because it's a legacy JavaScript feature that doesn't work in arrow functions and lacks type safety. The overload approach works but requires declaring every possible signature explicitly, which becomes impractical beyond a few arguments.

Neither approach scales well for functions that truly need to accept any number of arguments while maintaining type safety. You need a way to declare "this function accepts any number of values of this type" without enumerating every possibility.

## Solving the problem with rest parameters

Rest parameters collect all remaining arguments into a typed array, enabling variadic functions with full type safety. The `...` syntax before the last parameter tells TypeScript to gather all additional arguments into an array of the specified type.

This transforms variable argument lists into strongly-typed arrays that work with all array methods while maintaining compile-time guarantees about element types. TypeScript enforces that rest parameters appear last in the parameter list and that all spread arguments match the declared type.

Let's create a new file with the proper rest parameter solution:

```typescript
[label src/solution.ts]
function sum(...numbers: number[]
): number {
  return numbers.reduce((total, n) => total + n, 0);
}

function logMessages(prefix: string,
[highlight]
...messages: string[]
[/highlight]
): void {
  messages.forEach(msg => console.log(`${prefix}: ${msg}`));
}

console.log("Sum of 1, 2, 3:", sum(1, 2, 3));
console.log("Sum of 1, 2, 3, 4, 5:", sum(1, 2, 3, 4, 5));

logMessages("INFO", "Server started", "Port 3000", "Ready");
```

Verify TypeScript accepts this:

```command
npx tsc --noEmit src/solution.ts
```

TypeScript compiles successfully now. The rest parameter `...numbers: number[]` tells the compiler that `sum` accepts any number of number arguments, collecting them into the `numbers` array. The function can use all array methods like `reduce` with full type safety.

Run the code to verify it works:

```command
npx tsx src/solution.ts
```

```text
[output]
Sum of 1, 2, 3: 6
Sum of 1, 2, 3, 4, 5: 15
INFO: Server started
INFO: Port 3000
INFO: Ready
```

Rest parameters enable clean variadic function signatures without overloads or unsafe argument object access. TypeScript ensures all arguments passed match the declared type, catching type mismatches at compile time.

## Solving the problem with rest parameters

Rest parameters collect all remaining arguments into a typed array, enabling variadic functions with full type safety. The `...` syntax before the last parameter tells TypeScript to gather all additional arguments into an array of the specified type.

This transforms variable argument lists into strongly-typed arrays that work with all array methods while maintaining compile-time guarantees about element types. TypeScript enforces that rest parameters appear last in the parameter list and that all spread arguments match the declared type.

Let's fix the `sum1` function by replacing it with a rest parameter version:

```typescript
[label src/problem.ts]
[highlight]
function sum(...numbers: number[]): number {
  return numbers.reduce((total, n) => total + n, 0);
}
[/highlight]

// Attempt 2: Multiple overloads (doesn't scale)
function sum2(a: number): number;
function sum2(a: number, b: number): number;
function sum2(a: number, b: number, c: number): number;
function sum2(...args: number[]): number {
  return args.reduce((sum, n) => sum + n, 0);
}

[highlight]
console.log("Sum:", sum(1, 2, 3));
[/highlight]
console.log("Sum2:", sum2(1, 2, 3));
```

Verify TypeScript accepts this:

```command
npx tsc --noEmit src/problem.ts
```

TypeScript compiles successfully now. The rest parameter `...numbers: number[]` tells the compiler that `sum` accepts any number of number arguments, collecting them into the `numbers` array. The function can use all array methods like `reduce` with full type safety.

Run the code to verify it works:

```command
npx tsx src/problem.ts
```

```text
[output]
Sum: 6
Sum2: 6
```

Rest parameters enable clean variadic function signatures without overloads or unsafe argument object access. Notice how `sum` is much simpler than `sum2` which requires multiple overload declarations. TypeScript ensures all arguments passed match the declared type, catching type mismatches at compile time.

## Using spread syntax with arrays

Spread syntax expands array elements into individual values, working as the inverse of rest parameters. Where rest collects arguments into arrays, spread distributes array elements as separate arguments. TypeScript tracks types through spread operations, ensuring spread arguments match function parameter types.

This enables passing arrays to functions expecting individual arguments without manual indexing or apply calls. The spread syntax maintains type information, so TypeScript verifies the array element type matches what the function accepts.

Let's explore array spreading with type-safe operations:

```typescript
[label src/spread-arrays.ts]
function calculateTotal(base: number, tax: number, shipping: number): number {
  return base + tax + shipping;
}

const costs: [number, number, number] = [100, 15, 10];

// Spread array into function arguments
console.log("Total:", calculateTotal(...costs));

// Combining arrays
const numbers1 = [1, 2, 3];
const numbers2 = [4, 5, 6];
const combined = [...numbers1, ...numbers2];
console.log("Combined:", combined);

// Copying arrays
const original = [1, 2, 3];
const copy = [...original];
console.log("Original:", original);
console.log("Copy:", copy);

// Adding elements while spreading
const base = [2, 3, 4];
const extended = [1, ...base, 5];
console.log("Extended:", extended);
```

Run this to see array spreading:

```command
npx tsx src/spread-arrays.ts
```

```text
[output]
Total: 125
Combined: [ 1, 2, 3, 4, 5, 6 ]
Original: [ 1, 2, 3 ]
Copy: [ 1, 2, 3 ]
Extended: [ 1, 2, 3, 4, 5 ]
```

The spread syntax `...costs` expands the tuple into three separate arguments for `calculateTotal`. TypeScript verifies the tuple has exactly three numbers matching the function's parameter types. Array spreading also works for combining arrays, creating shallow copies, and inserting elements at specific positions.

Spreading arrays into function calls requires type compatibility between array elements and function parameters. If the array contains wrong types or the function expects different parameter counts, TypeScript catches this at compile time.

## Spreading objects for composition

Object spread syntax creates new objects by copying properties from existing objects, enabling immutable updates and object composition with full type safety. TypeScript tracks property types through spread operations, ensuring composed objects maintain correct shapes.

This pattern appears frequently in React state updates, configuration merging, and functional programming where immutability matters. Object spreading creates shallow copies with overridden properties, making it easy to create variations of objects without mutation.

Let's build type-safe object composition with spread:

```typescript
[label src/spread-objects.ts]
interface User {
  id: string;
  name: string;
  email: string;
}

interface UserPreferences {
  theme: "light" | "dark";
  notifications: boolean;
}

interface FullProfile extends User, UserPreferences {
  lastLogin: Date;
}

const baseUser: User = {
  id: "U123",
  name: "Alice",
  email: "alice@example.com"
};

const preferences: UserPreferences = {
  theme: "dark",
  notifications: true
};

// Combine objects with spread
const profile: FullProfile = {
  ...baseUser,
  ...preferences,
  lastLogin: new Date()
};

console.log("Profile:", profile);

// Immutable update pattern
const updatedProfile = {
  ...profile,
  theme: "light" as const,
  lastLogin: new Date()
};

console.log("Updated theme:", updatedProfile.theme);

// Partial updates
function updateUser(user: User, updates: Partial<User>): User {
  return { ...user, ...updates };
}

const updated = updateUser(baseUser, { name: "Alice Smith" });
console.log("Updated user:", updated);
```

Run this to see object spreading:

```command
npx tsx src/spread-objects.ts
```

```text
[output]
Profile: {
  id: 'U123',
  name: 'Alice',
  email: 'alice@example.com',
  theme: 'dark',
  notifications: true,
  lastLogin: 2025-11-27T07:13:53.113Z
}
Updated theme: light
Updated user: { id: 'U123', name: 'Alice Smith', email: 'alice@example.com' }
```

Object spreading merges properties from multiple sources into new objects. Later spreads override earlier ones when property names collide, enabling the immutable update pattern where you copy an object and override specific properties. TypeScript ensures all required properties exist and types remain correct through the composition.


## Final thoughts

**Rest parameters eliminate the need for legacy JavaScript patterns like the `arguments` object** while providing complete type safety for functions that accept variable numbers of arguments. They scale from simple variadic functions to complex APIs without requiring exhaustive function overloads or unsafe type assertions.

Spread syntax complements rest parameters by enabling type-safe array and object composition. Whether combining configuration objects, forwarding function arguments, or merging data structures, **TypeScript verifies type compatibility** at every step while generating efficient JavaScript code.

The compile-time nature of TypeScript's rest and spread type checking means your code runs at full speed while catching argument count mismatches, type incompatibilities, and structural errors before execution. This makes them essential tools for building robust APIs that balance flexibility with safety.

Explore the [TypeScript handbook](https://www.typescriptlang.org/docs/handbook/2/functions.html#rest-parameters-and-arguments) to learn more about rest parameters with generic types and discover how spread syntax integrates with utility types for building sophisticated type-safe APIs.