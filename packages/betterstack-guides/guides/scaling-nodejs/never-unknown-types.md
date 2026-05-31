# Understanding TypeScript's never and unknown Types

TypeScript's `never` and `unknown` types solve different problems in type safety by representing the extremes of possibility. The `never` type represents values that can never occur, while `unknown` acts as a type-safe alternative to `any`. Together, they help you handle edge cases and external data with confidence.

These types prevent common runtime errors by forcing you to handle impossible states and validate uncertain data at compile time. Understanding when and how to use them transforms error-prone code into predictable, maintainable systems.

In this guide, you'll learn:

- How `never` and `unknown` types work and when to use them
- Building exhaustive type guards with `never`
- Creating type-safe parsers and validators with `unknown`

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
mkdir ts-never-unknown && cd ts-never-unknown
```

Initialize with ES modules:

```command
npm init -y && npm pkg set type="module"
```

Install dependencies:

```command
npm install -D typescript @types/node tsx
```

Create a TypeScript configuration file:

```command
npx tsc --init
```

This gives you a modern TypeScript environment ready for exploring `never` and `unknown` types with immediate code execution using `tsx`.

## The problem with incomplete type handling

Most TypeScript applications deal with data from external sources and complex state machines where not all scenarios are immediately obvious. Traditional approaches using `any` or incomplete type guards create blind spots where runtime errors hide until production.

Consider this common scenario where missing cases cause application failures:

```typescript
[label src/problem.ts]
type Theme = 'light' | 'dark' | 'auto';

function getThemeStyles(theme: Theme): string {
  switch (theme) {
    case 'light':
      return 'light-styles';
    case 'dark':
      return 'dark-styles';
    // Missing 'auto' case - no compile-time error!
  }
  // Function might return undefined at runtime
}

// External API data with unknown structure
function processApiResponse(data: any): User {
  return {
    id: data.id,     // Could be undefined or wrong type
    name: data.name, // Could be missing
  };
}

type User = { id: number; name: string; };

console.log(getThemeStyles('auto')); // undefined at runtime
```

Check the TypeScript compilation:

```command
npx tsc --noEmit src/problem.ts
```

TypeScript catches the incomplete switch statement when you have strict settings enabled, but the error message doesn't tell you which specific case is missing. While the `any` type for API data disables all type checking, allowing malformed data to pass through unchecked.

These generic error messages don't pinpoint the exact issue - you know something is wrong, but not which specific case is missing. This becomes more problematic in complex applications where switch statements handle many cases, and the missing one isn't immediately obvious. The `any` type compounds the problem by disabling validation entirely, letting malformed external data cause runtime crashes.

## Solving exhaustiveness with `never`

The `never` type represents values that should never exist, making it perfect for catching incomplete type handling at compile time. When TypeScript encounters a code path that should be unreachable, assigning to `never` forces you to handle all possible cases.

This creates compile-time guarantees that your code handles every scenario in union types and state machines. TypeScript's control flow analysis ensures that `never` assignments only occur when all other possibilities have been eliminated.

Let's fix the incomplete switch statement using `never`:

```typescript
[label src/problem.ts]
type Theme = 'light' | 'dark' | 'auto';

function getThemeStyles(theme: Theme): string {
  switch (theme) {
    case 'light':
      return 'light-styles';
    case 'dark':
      return 'dark-styles';
[highlight]
    case 'auto':
      return 'auto-styles';
    default:
      // This line ensures exhaustiveness
      const exhaustiveCheck: never = theme;
      throw new Error(`Unhandled theme: ${exhaustiveCheck}`);
[/highlight]
  }
}
...
console.log(getThemeStyles('auto')); // Now works correctly
```

Now test what happens when you add a new theme without updating the function:

```typescript
[label src/problem.ts]
[highlight]
type Theme = 'light' | 'dark' | 'auto' | 'contrast';
[/highlight]

// Keep the same getThemeStyles function...
function getThemeStyles(theme: Theme): string {
 ...
}
...
```

Check the compilation:

```command
npx tsc --noEmit src/problem.ts
```

```text
[output]
src/problem.ts:13:13 - error TS2322: Type '"contrast"' is not assignable to type 'never'.

13       const exhaustiveCheck: never = theme;
               ~~~~~~~~~~~~~~~


Found 1 error in src/problem.ts:13
```

TypeScript immediately catches the missing case. The error points exactly to the line where the exhaustiveness check fails, making it clear that you need to handle the new `contrast` theme. This prevents the bug from reaching production.

### Understanding `never` type mechanics

The `never` type works through TypeScript's control flow analysis. When you reach a `default` case in a switch statement or an `else` clause after checking all union members, TypeScript knows that the remaining type should be empty.

Assigning this "impossible" value to `never` creates a compile-time assertion. If TypeScript can prove that the assignment is safe (meaning the value can never exist), compilation succeeds. If new cases are added to the union type, TypeScript can no longer prove the assignment is safe, triggering a compile error.

This pattern works for any exhaustive checking scenario, not just switch statements. You can use `never` in if-else chains, array filters, and any other control flow where you need to ensure all cases are handled.

## Creating type-safe parsers with `unknown`

The `unknown` type represents values whose type is not yet determined, making it the safe alternative to `any` for handling external data. Unlike `any`, which disables type checking entirely, `unknown` requires explicit type validation before you can access properties or call methods.

This forces you to validate data structure before using it, preventing the runtime errors that occur when external APIs return unexpected formats. The type system guides you through the validation process, ensuring thorough error handling.

Let's create a type-safe API response parser:

```typescript
[label src/safe-parsing.ts]
type User = { id: number; name: string; };

function parseUser(data: unknown): User {
  if (typeof data !== 'object' || data === null) {
    throw new Error('Invalid user data: not an object');
  }

  const obj = data as Record<string, unknown>;

  if (typeof obj.id !== 'number') {
    throw new Error('Invalid user data: id must be a number');
  }
  if (typeof obj.name !== 'string') {
    throw new Error('Invalid user data: name must be a string');
  }

  return { id: obj.id, name: obj.name };
}

// Test with different data
const validData: unknown = { id: 123, name: 'Alice' };
const invalidData: unknown = { id: '123', name: 'Bob' };

console.log(parseUser(validData));   // Works
console.log(parseUser(invalidData)); // Throws error
```

Run this to see the validation in action:

```command
npx tsx src/safe-parsing.ts
```

```text
[output]
{ id: 123, name: 'Alice' }
Error: Invalid user data: id must be a number
    at parseUser (/path/to/src/safe-parsing.ts:12:11)
```

The `unknown` type forces explicit validation at each step. TypeScript prevents you from accessing properties until you've proven they exist and have the correct types. This creates a validation funnel that catches data structure mismatches before they cause runtime errors.


## Combining `never` and `unknown` for bulletproof APIs

When you combine exhaustive checking with safe parsing, you create APIs that handle both internal state consistency and external data validation. This approach prevents the two most common sources of runtime errors in TypeScript applications.

Let's build this step by step. First, imagine you're handling API responses that can have different statuses:

```typescript
[label src/complete-example.ts]
type ApiStatus = 'success' | 'error';

// Start simple - just handle the two main cases
function handleApiResponse(response: unknown): string {
  // First, validate it's an object (unknown safety)
  if (typeof response !== 'object' || response === null) {
    throw new Error('Invalid response format');
  }
  
  const obj = response as Record<string, unknown>;
  
  // Then handle all possible statuses (never safety)
  switch (obj.status) {
    case 'success':
      return 'Operation succeeded';
    case 'error':
      return 'Operation failed';
    default:
      const exhaustiveCheck: never = obj.status;
      throw new Error(`Unknown status: ${exhaustiveCheck}`);
  }
}

// Test it works
const successResponse: unknown = { status: 'success' };
const errorResponse: unknown = { status: 'error' };

console.log(handleApiResponse(successResponse)); // "Operation succeeded"
console.log(handleApiResponse(errorResponse));   // "Operation failed"
```

Now watch what happens when your API adds a new status. Update the type:

```typescript
[label src/complete-example.ts]
[highlight]
type ApiStatus = 'success' | 'error' | 'pending';
[/highlight]

// Keep the same handleApiResponse function...
```

Run this to see the `never` type catch the missing case:

```command
npx tsc --noEmit src/complete-example.ts
```

```text
[output]

src/complete-example.ts:19:13 - error TS2322: Type 'unknown' is not assignable to type 'never'.

19       const exhaustiveCheck: never = obj.status;
               ~~~~~~~~~~~~~~~


Found 1 error in src/complete-example.ts:19
```

The `unknown` type forced you to validate the response structure first, and the `never` type ensures you handle all possible statuses. Together, they create a system that catches both malformed data and incomplete logic at compile time.

## Final thoughts

The `never` and `unknown` types transform error-prone areas of TypeScript development into compile-time guarantees. Using `never` for exhaustiveness checking prevents incomplete state handling, while `unknown` forces explicit validation of uncertain data.

These types work best when used together as part of a defensive programming approach. They catch different classes of errors at compile time, reducing debugging time and improving application reliability.

The compile-time nature of both types means zero runtime performance impact while providing mathematical guarantees about code correctness. This makes them essential tools for building maintainable TypeScript applications that handle complex state and external data safely.

Explore the [TypeScript handbook](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) to learn more advanced patterns for type narrowing and discover how these types integrate with other TypeScript language constructs.