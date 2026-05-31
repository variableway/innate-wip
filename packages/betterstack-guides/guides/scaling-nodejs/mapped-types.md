# TypeScript Mapped Types: DRY, Reusable Type Utilities

Mapped types let you take an existing type and systematically change its properties. You can go through each property and adjust it in a controlled way, which gives you something close to programming logic for your TypeScript types. Added in TypeScript 2.1, **mapped types make it simple to build new types from existing ones**, for example by turning all properties into optional, readonly, nullable, or by changing what type of value they hold.

Instead of writing similar types again and again, you **describe the rule for how a type should be changed, and TypeScript does the rest**. This keeps your code DRY, keeps new types in sync when the original type changes, and lets you build reusable helpers for common patterns.

In this guide, you will learn how mapped types work and when to use them, how to build useful type utilities by transforming properties, and how to create type safe adapters for external APIs and data models.

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
mkdir ts-mapped-types && cd ts-mapped-types
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

This initializes a `tsconfig.json` file, giving you a solid TypeScript setup. With these steps complete, you now have a modern TypeScript environment ready for exploring mapped types with immediate code execution capabilities using `tsx`.

## Understanding the type duplication problem

TypeScript applications frequently need variations of the same type structure—a User type with all optional fields for updates, the same type with readonly properties for display, or transformed property types for API serialization. Without mapped types, developers manually duplicate type definitions with slight variations, creating maintenance nightmares when the source type evolves.

Let's examine how this duplication problem manifests in a typical application:

```typescript
[label src/problem.ts]
interface User {
  id: number;
  name: string;
  email: string;
}

// Manual duplication for partial updates
interface UserUpdate {
  id?: number;
  name?: string;
  email?: string;
}

// Manual duplication for readonly views
interface UserDisplay {
  readonly id: number;
  readonly name: string;
  readonly email: string;
}

const update: UserUpdate = { name: "Alice Smith" };
const display: UserDisplay = { id: 1, name: "Alice", email: "alice@example.com" };

console.log("Update:", update);
console.log("Display:", display);
```

Run this code to see it work:

```command
npx tsx src/problem.ts
```

```text
[output]
Update: { name: 'Alice Smith' }
Display: { id: 1, name: 'Alice', email: 'alice@example.com' }
```

The code functions correctly, but the type definitions reveal a critical maintainability issue. Adding a new property to `User` requires updating it in three separate places. Forgetting to update `UserUpdate` or `UserDisplay` creates type inconsistencies that only surface when new fields are accessed.

This pattern compounds in real applications where a single domain model might spawn dozens of variations—partial types for updates, readonly types for responses, nullable types for optional data, and stringified versions for serialization. Each variation multiplies the maintenance burden and increases the likelihood of type drift.

## Solving the problem with mapped types

Mapped types eliminate duplication by programmatically deriving new types from existing ones. Instead of manually copying and modifying each property, you write a transformation rule that TypeScript applies automatically to every property in the source type.

The syntax uses index signatures with the `in` keyword to iterate over property keys. The pattern `[K in keyof T]` means "for each property key K in type T", letting you apply transformations systematically across all properties.

Let's refactor the previous example using mapped types:

```typescript
[label src/problem.ts]
interface User {
  id: number;
  name: string;
  email: string;
}

[highlight]
// Mapped type that makes all properties optional
type UserUpdate = {
  [K in keyof User]?: User[K];
};

// Mapped type that makes all properties readonly
type UserDisplay = {
  readonly [K in keyof User]: User[K];
};
[/highlight]

const update: UserUpdate = { name: "Alice Smith" };
const display: UserDisplay = { id: 1, name: "Alice", email: "alice@example.com" };

// This would cause an error:
// display.name = "Bob";  // Error: Cannot assign to 'name' because it is a read-only property

console.log("Update:", update);
console.log("Display:", display);
```

Run this to see mapped types in action:

```command
npx tsx src/problem.ts
```

```text
[output]
Update: { name: 'Alice Smith' }
Display: { id: 1, name: 'Alice', email: 'alice@example.com' }
```

The mapped types `UserUpdate` and `UserDisplay` now derive automatically from `User`. Adding a new property to `User` immediately reflects in both derived types without any manual intervention. This creates a single source of truth that eliminates synchronization bugs.

### Understanding mapped type mechanics

Mapped types work through three distinct operations that TypeScript performs during type checking:

1. **Property iteration**: `keyof User` extracts all property keys as a union type (`"id" | "name" | "email" | "age"`)
2. **Type mapping**: `[K in keyof User]` iterates over each key, binding it to the variable `K`
3. **Property transformation**: `User[K]` accesses the original property type, while modifiers like `?` or `readonly` change its characteristics

The transformation happens entirely at compile time through TypeScript's structural type system. The generated JavaScript contains regular object literals with no mapping logic—mapped types exist purely as a development-time construct that provides guarantees about object structure.

This differs from runtime transformations where you'd use `Object.keys()` and build new objects. Mapped types generate new type definitions that describe objects without creating actual objects or adding runtime overhead.

## Building reusable type utilities

Mapped types become powerful when abstracted into generic utilities that work with any type. Instead of creating custom mapped types for each interface, you define transformation patterns once and apply them universally across your codebase.

TypeScript's standard library includes several built-in mapped type utilities, but understanding how to build custom ones reveals the full power of this feature.

Let's create practical utilities that solve common transformation needs:

```typescript
[label src/utilities.ts]
// Make all properties nullable
type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

// Make specific properties optional
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

interface Product {
  id: number;
  name: string;
  price: number;
}

// All properties can be null (for database results)
type NullableProduct = Nullable<Product>;

const dbProduct: NullableProduct = {
  id: 1,
  name: "Laptop",
  price: null  // Valid - might be missing in DB
};

// Only specific properties are optional
type ProductInput = PartialBy<Product, "id">;

const newProduct: ProductInput = {
  name: "Mouse",
  price: 25
  // id is optional
};

console.log("Database product:", dbProduct);
console.log("New product input:", newProduct);
```

Run this to see the transformations in action:

```command
npx tsx src/utilities.ts
```

```text
[output]
Database product: { id: 1, name: 'Laptop', price: null }
New product input: { name: 'Mouse', price: 25 }
```

These utilities handle two common scenarios: database results that might contain nulls and API inputs where certain fields are optional. Each utility encapsulates a transformation pattern that you can apply to any type.

The `PartialBy` utility demonstrates advanced composition—it combines `Omit`, `Partial`, and `Pick` to make only specific properties optional. This level of precision would require significant boilerplate without mapped types.

## Creating conditional property transformations

Mapped types support conditional logic that transforms properties differently based on their value types. This enables sophisticated type utilities that apply different rules to different kinds of properties within the same type.

The conditional type syntax `T[K] extends Condition ? TrueType : FalseType` lets you check property types and branch accordingly. Combined with mapped types, this creates powerful type transformations that respect property semantics.

Let's build utilities that transform properties conditionally:

```typescript
[label src/conditional.ts]
// Make only function properties optional
type OptionalMethods<T> = {
  [K in keyof T]: T[K] extends Function ? T[K] | undefined : T[K];
};

// Convert Date properties to ISO strings
type SerializeDates<T> = {
  [K in keyof T]: T[K] extends Date ? string : T[K];
};

interface Article {
  id: number;
  title: string;
  publishedAt: Date;
  render: () => string;
}

type ArticleWithOptionalMethods = OptionalMethods<Article>;

const article1: ArticleWithOptionalMethods = {
  id: 1,
  title: "TypeScript Guide",
  publishedAt: new Date()
  // render is optional now
};

type SerializedArticle = SerializeDates<Article>;

const article2: SerializedArticle = {
  id: 2,
  title: "Advanced Types",
  publishedAt: "2024-01-15T10:30:00.000Z",  // Date became string
  render: () => "..."
};

console.log("Article with optional methods:", article1);
console.log("Serialized article:", article2);
```

Check what TypeScript reports:

```command
npx tsc --noEmit src/conditional.ts
```

```text
[output]
src/conditional.ts:20:7 - error TS2741: Property 'render' is missing in type '{ id: number; title: string; publishedAt: Date; }' but required in type 'OptionalMethods<Article>'.

20 const article1: ArticleWithOptionalMethods = {
         ~~~~~~~~

  src/conditional.ts:15:3
    15   render: () => string;
         ~~~~~~
    'render' is declared here.


Found 1 error in src/conditional.ts:20
```

The error reveals a limitation: TypeScript's conditional type `T[K] extends Function` doesn't make the property optional—it only adds `undefined` to the union type. The property is still required but can be `undefined`. To actually make function properties optional, we need to use mapped type modifiers with key remapping.

Let's fix this with the correct approach:

```typescript
[label src/conditional.ts]
[highlight]
// Make only function properties optional using mapped type modifiers
type OptionalMethods<T> = {
  [K in keyof T as T[K] extends Function ? K : never]?: T[K];
} & {
  [K in keyof T as T[K] extends Function ? never : K]: T[K];
};
[/highlight]

// Convert Date properties to ISO strings
type SerializeDates<T> = {
  [K in keyof T]: T[K] extends Date ? string : T[K];
};

...
```

Run this to see conditional transformations:

```command
npx tsx src/conditional.ts
```

```text
[output]
Article with optional methods: {
  id: 1,
  title: 'TypeScript Guide',
  publishedAt: 2025-12-01T09:27:39.328Z
}
Serialized article: {
  id: 2,
  title: 'Advanced Types',
  publishedAt: '2024-01-15T10:30:00.000Z',
  render: [Function: render]
}
```

These conditional utilities handle scenarios that appear frequently in real applications. Making methods optional helps with partial implementations or mocking. Converting dates to ISO strings solves serialization requirements for APIs.

The conditional logic operates during type checking, examining each property's type and applying the appropriate transformation. This creates precise type definitions that respect the semantic meaning of different property kinds.

## Final thoughts

**Mapped types move you away from manually keeping different types in sync and instead let the compiler derive them for you**. This removes a whole category of bugs that come from “type drift,” where one type is updated and another related type is forgotten. As you start with simple property changes and then add more conditional logic, mapped types can grow with your needs while still respecting the meaning of each property.

Because all of this happens at compile time, there is no extra cost at runtime. At the same time, you get strong guarantees that related types stay consistent. **This is especially valuable in large codebases, where trying to maintain many slightly different versions of the same type** by hand quickly becomes unmanageable.

In practice, mapped types turn type definitions from fixed, static shapes into small, reusable transformations. **You define how a type should be changed once, and then apply that transformation wherever you need it**. This cuts down on duplication and makes your types easier to maintain over time.

If you want to go deeper into these ideas, you can explore the [TypeScript handbook](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html), which covers more advanced patterns and shows how mapped types can improve both the safety and the long-term maintainability of your application.