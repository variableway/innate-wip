# Understanding TypeScript Conditional Types and infer

Conditional types enable runtime-like logic at the type level by letting you create types that change based on conditions. Combined with the infer keyword, they unlock pattern matching capabilities that **extract types from complex structures**, making it possible to build sophisticated type transformations that adapt to your data.

These features transform TypeScript's type system from static declarations into a computational engine that can inspect types, extract components, and make decisions based on type relationships. The result is **reusable type utilities** that work across different shapes while maintaining complete type safety.

In this guide, you'll learn:

- How conditional types work with the extends keyword
- Extracting types from complex structures using infer
- Building practical type utilities for real-world scenarios

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
mkdir ts-conditional-types && cd ts-conditional-types
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

This initializes a `tsconfig.json` file, giving you a solid TypeScript setup. With these steps complete, you now have a modern TypeScript environment ready for exploring conditional types and the infer keyword with immediate code execution capabilities using `tsx`.

## Understanding the type inflexibility problem

TypeScript's basic types work well for straightforward scenarios where you know exactly what types you need upfront. However, when building reusable utilities that must adapt to different input types, basic type aliases and interfaces fall short. You end up creating multiple versions of similar types or losing type information through overly broad generics.

This limitation becomes apparent when working with functions that return different types based on their input, API responses with varying shapes, or data transformations where output types depend on input structure. Basic generics can pass types through but can't make decisions or extract components based on type relationships.

Let's examine a function wrapper scenario where this inflexibility creates problems:

```typescript
[label src/problem.ts]
// Basic type that doesn't adapt to input
type ApiResponse<T> = {
  data: T;
  error: null;
} | {
  data: null;
  error: string;
};

function fetchUser(): ApiResponse<{ name: string; email: string }> {
  return { data: { name: "John", email: "john@example.com" }, error: null };
}

function fetchPosts(): ApiResponse<Array<{ id: number; title: string }>> {
  return { data: [{ id: 1, title: "Hello" }], error: null };
}

// Try to create a generic unwrap function
function unwrapResponse<T>(response: ApiResponse<T>): T {
  if (response.error) {
    throw new Error(response.error);
  }
  return response.data;
}

const user = unwrapResponse(fetchUser());
const posts = unwrapResponse(fetchPosts());

console.log(user.name);
console.log(posts[0].title);
```

Run this code to see the type issues:

```command
npx tsx src/problem.ts
```

```text
[output]
John
Hello
```

The code runs fine at runtime, but check what TypeScript thinks:

```command
npx tsc --noEmit src/problem.ts
```

```text
[output]
src/problem.ts(23,18): error TS2322: Type 'null' is not assignable to type 'T'.
  'T' could be instantiated with an arbitrary type which could be unrelated to 'null'.


Found 1 error in the same file.
```

TypeScript rejects the function because `response.data` could be `null` when there's an error, but the function promises to return `T`. The union type creates ambiguity that basic generics can't resolve. You need conditional logic at the type level to express "if there's no error, return the data type; otherwise, throw."

This pattern scales poorly. Every function that needs type-level decisions requires workarounds like type assertions or overloads, cluttering your codebase with manual type management that should be automatic.

## Solving the problem with conditional types

Conditional types introduce if-then logic at the type level using the syntax `T extends U ? X : Y`. When TypeScript evaluates this expression, it checks if type `T` is assignable to type `U`. If true, the conditional resolves to type `X`; otherwise, it resolves to type `Y`. This creates types that adapt based on type relationships.

The `extends` keyword in conditional types works like type compatibility checking—it asks "can `T` be used wherever `U` is expected?" This differs from `extends` in generic constraints, which restricts what types can be passed in. Conditional types make decisions after type parameters are known.

Let's fix the previous example with conditional types:

```typescript
[label src/problem.ts]
type ApiResponse<T> = {
  data: T;
  error: null;
} | {
  data: null;
  error: string;
};

[highlight]
// Conditional type that checks for error state
type UnwrapResponse<T> = T extends { error: string } ? never : T extends { data: infer D } ? D : never;
[/highlight]

function fetchUser(): ApiResponse<{ name: string; email: string }> {
  return { data: { name: "John", email: "john@example.com" }, error: null };
}

function fetchPosts(): ApiResponse<Array<{ id: number; title: string }>> {
  return { data: [{ id: 1, title: "Hello" }], error: null };
}

[highlight]
// Generic unwrap function using conditional type
function unwrapResponse<T extends ApiResponse<any>>(response: T): UnwrapResponse<T> {
  if (response.error) {
    throw new Error(response.error);
  }
  return response.data as UnwrapResponse<T>;
}
[/highlight]

const user = unwrapResponse(fetchUser());
const posts = unwrapResponse(fetchPosts());

console.log(user.name);
console.log(posts[0].title);
```

Check what happens when TypeScript validates this code:

```command
npx tsc --noEmit src/problem.ts
```

TypeScript compiles successfully. The conditional type checks if the response has an error property, and if not, extracts the data type using `infer`. The function can now safely return the unwrapped data type because TypeScript understands the conditional logic at the type level.

### Understanding conditional type mechanics

Conditional types work by evaluating type relationships during compilation. When TypeScript encounters `T extends U ? X : Y`, it performs structural compatibility checking between `T` and `U`. This happens after type parameters are resolved but before types are assigned to values.

The evaluation process:

1. **Type parameter resolution**: TypeScript determines what `T` actually is from usage
2. **Extends check**: TypeScript checks if `T`'s structure is assignable to `U`
3. **Branch selection**: Based on the result, TypeScript selects either `X` or `Y` as the final type

The expression `T extends { error: string } ? never : ...` checks if `T` has an `error` property of type `string`. If true, the type becomes `never` (indicating this branch shouldn't be used). If false, TypeScript evaluates the next condition to extract the data type.

This differs from runtime conditionals—the checking happens entirely during compilation and produces zero runtime code. The conditional types guide TypeScript's type checking without affecting program execution.

## Extracting types with the infer keyword

The infer keyword lets you extract type components from complex structures during conditional type evaluation. When you write `T extends SomePattern<infer U>`, TypeScript matches `T` against the pattern and captures the matching type component as `U`. This enables pattern matching at the type level.

The infer keyword only works within the `extends` clause of conditional types. TypeScript uses it to create a type variable that represents a piece of the matched type, making that extracted type available in the conditional's true branch.

Let's explore practical uses of infer with function types:

```typescript
[label src/infer.ts]
// Extract return type from any function
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

// Extract parameter types from any function
type Parameters<T> = T extends (...args: infer P) => any ? P : never;

// Extract first parameter type
type FirstParameter<T> = T extends (first: infer F, ...args: any[]) => any ? F : never;

// Test with actual functions
function createUser(name: string, email: string): { id: number; name: string; email: string } {
  return { id: 1, name, email };
}

function fetchData(url: string): Promise<any> {
  return fetch(url).then(r => r.json());
}

// Extract types using our utilities
type CreateUserReturn = ReturnType<typeof createUser>;
type CreateUserParams = Parameters<typeof createUser>;
type CreateUserFirstParam = FirstParameter<typeof createUser>;

type FetchDataReturn = ReturnType<typeof fetchData>;
type FetchDataParams = Parameters<typeof fetchData>;

// Use the extracted types
const user: CreateUserReturn = {
  id: 1,
  name: "John",
  email: "john@example.com"
};

const params: CreateUserParams = ["John", "john@example.com"];
const firstName: CreateUserFirstParam = "John";

console.log("User:", user);
console.log("Params:", params);
console.log("First param:", firstName);
```

Run the code to see the extracted types in action:

```command
npx tsx src/infer.ts
```

```text
[output]
User: { id: 1, name: 'John', email: 'john@example.com' }
Params: [ 'John', 'john@example.com' ]
First param: John
```

The infer keyword captures the return type `R` from functions, the parameters tuple `P`, and even specific parameter types like the first parameter `F`. TypeScript validates that the extracted types match the actual function signatures, providing type safety without manual annotations.

Check that types are correctly inferred:

```typescript
[label src/infer.ts]
...
// This should error - wrong type for user
const badUser: CreateUserReturn = {
  id: "wrong",
  name: "John",
  email: "john@example.com"
};
```

Check the validation:

```command
npx tsc --noEmit src/infer.ts
```

```text
[output]
src/infer.ts(38,3): error TS2322: Type 'string' is not assignable to type 'number'.


Found 1 error in the same file.
```

TypeScript catches the type error because the extracted `CreateUserReturn` type knows that `id` must be a number. The infer keyword preserves complete type information from the original function signature.

## Building practical type utilities

Conditional types with infer become powerful when building reusable utilities that work across different data structures. This pattern appears frequently in API clients, state management libraries, and data transformation pipelines where you need to derive types from existing structures automatically.

Let's create a comprehensive API response handler that demonstrates these capabilities:

```typescript
[label src/utilities.ts]
// Extract the success data type from an API response
type ExtractData<T> = T extends { data: infer D } ? D : never;

// Extract the error type from an API response
type ExtractError<T> = T extends { error: infer E } ? E : never;

// Create a discriminated union for better type narrowing
type ApiResult<T> =
  | { success: true; data: T; error: null }
  | { success: false; data: null; error: string };

// Unwrap the data type from an ApiResult
type UnwrapResult<T> = T extends ApiResult<infer D> ? D : never;

// Example API functions
function getUser(id: number): ApiResult<{ id: number; name: string; email: string }> {
  if (id > 0) {
    return {
      success: true,
      data: { id, name: "John Doe", email: "john@example.com" },
      error: null
    };
  }
  return {
    success: false,
    data: null,
    error: "Invalid user ID"
  };
}

function getPosts(): ApiResult<Array<{ id: number; title: string; content: string }>> {
  return {
    success: true,
    data: [
      { id: 1, title: "First Post", content: "Hello World" },
      { id: 2, title: "Second Post", content: "TypeScript is great" }
    ],
    error: null
  };
}

// Generic handler that uses conditional types
function handleResult<T extends ApiResult<any>>(result: T): UnwrapResult<T> {
  if (!result.success) {
    throw new Error(result.error);
  }
  return result.data;
}

// TypeScript infers precise types for each call
const user = handleResult(getUser(1));
const posts = handleResult(getPosts());

console.log(`User: ${user.name} (${user.email})`);
console.log(`Posts: ${posts.map(p => p.title).join(", ")}`);

// Type-safe access to extracted types
type User = UnwrapResult<ReturnType<typeof getUser>>;
type Post = UnwrapResult<ReturnType<typeof getPosts>>[number];

const newUser: User = { id: 2, name: "Jane", email: "jane@example.com" };
const newPost: Post = { id: 3, title: "Third Post", content: "More content" };

console.log("New user:", newUser);
console.log("New post:", newPost);
```

Run the code to see the type utilities working:

```command
npx tsx src/utilities.ts
```

```text
[output]
User: John Doe (john@example.com)
Posts: First Post, Second Post
New user: { id: 2, name: 'Jane', email: 'jane@example.com' }
New post: { id: 3, title: 'Third Post', content: 'More content' }
```

The type utilities automatically extract the correct types from the API response structures. TypeScript knows that `user` has `name` and `email` properties, and that `posts` is an array with `title` and `content` properties—all without manual type annotations at the call sites.

Let's verify the type safety by adding invalid data:

```typescript
[label src/utilities.ts]
...
// This should error - missing required properties
const invalidUser: User = { id: 3, name: "Bob" };
```

Check the validation:

```command
npx tsc --noEmit src/utilities.ts
```

```text
[output]
src/utilities.ts(58,7): error TS2741: Property 'email' is missing in type '{ id: number; name: string; }' but required in type '{ id: number; name: string; email: string; }'.


Found 1 error in the same file.
```

TypeScript catches the missing `email` property because the conditional types preserve complete structural information. The combination of conditional types and infer creates type utilities that adapt to different inputs while maintaining full type safety.

## Advanced patterns with nested inference

Conditional types with multiple infer keywords can extract types from deeply nested structures. This enables sophisticated type transformations that traverse complex type hierarchies to pull out specific components.

Let's explore advanced inference patterns:

```typescript
[label src/advanced.ts]
// Extract the resolved type from a Promise
type Awaited<T> = T extends Promise<infer U> ? Awaited<U> : T;

// Extract array element type
type ElementType<T> = T extends (infer E)[] ? E : never;

// Extract nested object property types
type DeepValue<T, K extends string> = K extends `${infer First}.${infer Rest}`
  ? First extends keyof T
    ? DeepValue<T[First], Rest>
    : never
  : K extends keyof T
    ? T[K]
    : never;

// Test nested Promise unwrapping
type NestedPromise = Promise<Promise<Promise<number>>>;
type UnwrappedNumber = Awaited<NestedPromise>;

const value: UnwrappedNumber = 42;
console.log("Unwrapped value:", value);

// Test array element extraction
type NumberArray = number[];
type StringArray = string[];

type NumElement = ElementType<NumberArray>;
type StrElement = ElementType<StringArray>;

const num: NumElement = 42;
const str: StrElement = "hello";

console.log("Array elements:", num, str);

// Test deep property access
type User = {
  profile: {
    settings: {
      theme: "light" | "dark";
      notifications: boolean;
    };
  };
  posts: Array<{ title: string; views: number }>;
};

type Theme = DeepValue<User, "profile.settings.theme">;
type Notifications = DeepValue<User, "profile.settings.notifications">;

const theme: Theme = "dark";
const notifications: Notifications = true;

console.log("User preferences:", theme, notifications);
```

Run the code to see advanced type inference:

```command
npx tsx src/advanced.ts
```

```text
[output]
Unwrapped value: 42
Array elements: 42 hello
User preferences: dark true
```

The recursive `Awaited` type unwraps nested Promises by calling itself with the inferred inner type until reaching a non-Promise type. The `DeepValue` type traverses nested object paths using template literal types and recursive inference to extract deeply nested property types.

These patterns demonstrate how conditional types with infer create composable type-level functions that can express complex transformations declaratively, making your types as expressive as your runtime code.

## Final thoughts

Conditional types bring computational logic to TypeScript's type system through the `extends ? :` syntax, enabling types that adapt based on type relationships. The infer keyword adds pattern matching capabilities that extract type components from complex structures, making sophisticated type transformations possible.

The compile-time nature provides zero runtime overhead while dramatically **improving type safety through automatic type derivation**. This makes conditional types and infer valuable for any code that needs type-level decisions, whether for utility types, API clients, or data transformation pipelines.

These features transform TypeScript from a type annotation system into a type programming language where types can **inspect, extract, and transform other types automatically**, reducing manual type management while increasing safety.

Explore the [TypeScript handbook on conditional types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html) to learn more advanced patterns and discover how these features can enhance your application's type safety.
