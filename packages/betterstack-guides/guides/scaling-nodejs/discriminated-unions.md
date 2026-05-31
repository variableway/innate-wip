# TypeScript Discriminated Unions: Safer States, APIs, and Events

Discriminated unions let you model data that can be one of several distinct shapes, where each shape has a unique marker that TypeScript can use to determine which variant you're working with. This pattern gives you precise type narrowing based on a common property, turning what would be loose runtime checks into compile-time guarantees. Introduced as a core feature in TypeScript 2.0, **discriminated unions make it straightforward to represent choices and variants in your types**, for example when handling different message types, multiple form states, or varied API responses.

Instead of relying on loose type assertions or unsafe type guards, you **establish a clear discriminator property that TypeScript recognizes and uses to narrow types automatically**. This approach eliminates entire classes of runtime errors, makes your intentions explicit in the type system, and creates code that's both safer and easier to understand.

In this guide, you will learn how discriminated unions work and when they solve real problems, how to build type-safe state machines and event systems using discriminators, and how to handle complex scenarios like nested unions and exhaustiveness checking.

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
mkdir ts-discriminated-unions && cd ts-discriminated-unions
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

This initializes a `tsconfig.json` file, giving you a solid TypeScript setup. With these steps complete, you now have a modern TypeScript environment ready for exploring discriminated unions with immediate code execution capabilities using `tsx`.

## Understanding the type safety problem with variants

Applications regularly need to represent data that comes in multiple forms—API responses that succeed or fail with different structures, UI states that carry different data depending on whether content is loading or displaying, or event systems where each event type has its own payload shape. Without discriminated unions, developers typically use loose unions with optional properties, creating situations where TypeScript can't verify that you're accessing the right fields for the right variant.

Let's examine how this lack of precision creates problems in practice:

```typescript
[label src/problem.ts]
interface ApiResponse {
  status: "success" | "error";
  data?: { userId: number; username: string };
  error?: { message: string; code: number };
}

function handleResponse(response: ApiResponse) {
  if (response.status === "success") {
    // TypeScript doesn't narrow here - data might be undefined
    console.log(`User: ${response.data?.username}`);
  } else {
    // Same issue - error might be undefined
    console.log(`Error: ${response.error?.message}`);
  }
}

const success: ApiResponse = {
  status: "success",
  data: { userId: 1, username: "alice" }
};

const failure: ApiResponse = {
  status: "error",
  error: { message: "Not found", code: 404 }
};

handleResponse(success);
handleResponse(failure);
```

Check what TypeScript reports about this code:

```command
npx tsc --noEmit src/problem.ts
```

```text
[output]
(No errors - TypeScript accepts this code)
```

Run this code to see it works:

```command
npx tsx src/problem.ts
```

```text
[output]
User: alice
Error: Not found
```

The code executes correctly and TypeScript doesn't report any errors, but this is precisely the problem. Even though we check `response.status`, TypeScript still treats `data` and `error` as potentially undefined because the type system can't connect the status value to which properties should exist. This forces defensive optional chaining throughout the code.

## Solving the problem with discriminated unions

Discriminated unions eliminate ambiguity by splitting a type into distinct variants, each identified by a literal value in a common discriminator property. TypeScript recognizes this pattern and automatically narrows the type when you check the discriminator, giving you precise access to variant-specific properties without optional chaining.

The pattern requires three elements: multiple types with a common property, that property using literal types as values, and combining those types into a union. When these elements align, TypeScript's control flow analysis narrows types based on discriminator checks.

Let's refactor the previous example using a proper discriminated union:

```typescript
[label src/problem.ts]
[highlight]
// Each variant is a separate type with the discriminator
interface SuccessResponse {
  status: "success";
  data: { userId: number; username: string };
}

interface ErrorResponse {
  status: "error";
  error: { message: string; code: number };
}

// Union of distinct variants
type ApiResponse = SuccessResponse | ErrorResponse;
[/highlight]

function handleResponse(response: ApiResponse) {
  if (response.status === "success") {
    // TypeScript knows response is SuccessResponse here
    console.log(`User: ${response.data.username}`);
  } else {
    // TypeScript knows response is ErrorResponse here
    console.log(`Error: ${response.error.message}`);
  }
}

const success: ApiResponse = {
  status: "success",
  data: { userId: 1, username: "alice" }
};

const failure: ApiResponse = {
  status: "error",
  error: { message: "Not found", code: 404 }
};

handleResponse(success);
handleResponse(failure);
```

Check what TypeScript reports with discriminated unions:

```command
npx tsc --noEmit src/problem.ts
```

```text
[output]
(No errors - TypeScript validates the discriminated union correctly)
```

Run this to see discriminated unions working:

```command
npx tsx src/problem.ts
```

```text
[output]
User: alice
Error: Not found
```

The discriminated union version provides complete type safety. When you check `response.status === "success"`, TypeScript narrows `response` to `SuccessResponse`, making `data` available without optional chaining. The same narrowing happens for the error case.

Critically, invalid combinations become impossible to construct. Let's try creating invalid states:

```typescript
[label src/invalid.ts]
interface SuccessResponse {
  status: "success";
  data: { userId: number; username: string };
}

interface ErrorResponse {
  status: "error";
  error: { message: string; code: number };
}

type ApiResponse = SuccessResponse | ErrorResponse;

// TypeScript rejects these invalid states:
const invalid1: ApiResponse = {
  status: "success",
  error: { message: "This makes no sense", code: 500 }  // Error!
};

const invalid2: ApiResponse = {
  status: "error",
  data: { userId: 1, username: "alice" }  // Error!
};
```

Check what TypeScript reports:

```command
npx tsc --noEmit src/invalid.ts
```

```text
[output]
src/invalid.ts:16:3 - error TS2353: Object literal may only specify known properties, and 'error' does not exist in type 'SuccessResponse'.

16   error: { message: "This makes no sense", code: 500 }, // Error!
     ~~~~~

src/invalid.ts:21:3 - error TS2353: Object literal may only specify known properties, and 'data' does not exist in type 'ErrorResponse'.

21   data: { userId: 1, username: "alice" }, // Error!
     ~~~~


Found 2 errors in the same file, starting at: src/invalid.ts:16
```

You cannot create an object with `status: "success"` that only has an `error` property—TypeScript rejects it because `SuccessResponse` requires `data`. This compile-time enforcement prevents entire categories of bugs that would only surface at runtime with the optional property approach.

### Understanding discriminator mechanics

Discriminated unions work through TypeScript's control flow analysis, which tracks how code execution paths affect types:

1. **Pattern recognition**: TypeScript identifies the discriminator property (must be the same name across all variants with literal types)
2. **Type narrowing**: When you check the discriminator value, TypeScript eliminates impossible variants from the union
3. **Property access**: After narrowing, only properties from the remaining variant(s) are accessible

The narrowing happens purely during type checking based on your conditional logic. TypeScript analyzes `if` statements, `switch` cases, and other control flow constructs to determine which variant applies in each code path. This creates guarantees about object structure without any runtime overhead—the generated JavaScript contains your logic with no additional type checking code.

This differs fundamentally from runtime type checking libraries that validate object shapes at runtime. Discriminated unions provide compile-time guarantees through static analysis, catching errors during development rather than in production.

## Building type-safe state machines

Discriminated unions excel at modeling state machines where each state carries different data and permits different transitions. This pattern appears frequently in UI components, async operations, and business logic where an entity moves through distinct phases with phase-specific information.

The discriminator serves as the current state, while each variant's properties represent the data relevant to that state. TypeScript enforces that you can only access state-appropriate data and helps ensure you handle all possible states.

Let's model a file upload flow with distinct states:

```typescript
[label src/state-machine.ts]
interface IdleState {
  status: "idle";
}

interface UploadingState {
  status: "uploading";
  progress: number;
  filename: string;
}

interface CompletedState {
  status: "completed";
  fileUrl: string;
  uploadedAt: Date;
}

interface FailedState {
  status: "failed";
  error: string;
  retryCount: number;
}

type UploadState = IdleState | UploadingState | CompletedState | FailedState;

function renderUploadUI(state: UploadState): string {
  switch (state.status) {
    case "idle":
      return "Ready to upload";

    case "uploading":
      return `Uploading ${state.filename}: ${state.progress}%`;

    case "completed":
      return `Upload finished: ${state.fileUrl}`;

    case "failed":
      return `Upload failed: ${state.error} (retry ${state.retryCount})`;
  }
}

// Simulate state transitions
const states: UploadState[] = [
  { status: "idle" },
  { status: "uploading", progress: 45, filename: "document.pdf" },
  { status: "completed", fileUrl: "https://cdn.example.com/doc.pdf", uploadedAt: new Date() },
  { status: "failed", error: "Network timeout", retryCount: 2 }
];

states.forEach(state => {
  console.log(renderUploadUI(state));
});
```

Run this to see state-based rendering:

```command
npx tsx src/state-machine.ts
```

```text
[output]
Ready to upload
Uploading document.pdf: 45%
Upload finished: https://cdn.example.com/doc.pdf
Upload failed: Network timeout (retry 2)
```

The discriminated union enforces that each state carries exactly the data it needs. Let's see what happens if we try to create an invalid state:

```typescript
[label src/invalid-state.ts]
interface UploadingState {
  status: "uploading";
  progress: number;
  filename: string;
}

type UploadState = UploadingState | /* other states... */;

// Try to create uploading state without required fields
const incomplete: UploadState = {
  status: "uploading",
  progress: 50
  // missing filename
};
```

Check what TypeScript reports:

```command
npx tsc --noEmit src/invalid-state.ts
```

```text
[output]
src/invalid-state.ts:7:58 - error TS1110: Type expected.

7 type UploadState = UploadingState | /* other states... */;
                                                           ~


Found 1 error in src/invalid-state.ts:7
```

An uploading state must include progress and filename, while a completed state must include the file URL. TypeScript prevents accessing properties from the wrong state—you can't accidentally read `fileUrl` when the status is "uploading" because that property doesn't exist on `UploadingState`.

This approach scales naturally as requirements evolve. Adding a new state like `PausedState` requires adding it to the union and handling it in the switch statement. TypeScript's exhaustiveness checking (which we'll cover shortly) ensures you update all relevant code paths.

## Implementing exhaustiveness checking

One of the most valuable features of discriminated unions is exhaustiveness checking—TypeScript's ability to verify that you've handled every possible variant. This catches bugs when new variants are added to a union but existing code isn't updated to handle them.

The standard exhaustiveness check uses a helper function that accepts `never` as a parameter. If TypeScript can reach this function with a non-`never` type, it means you haven't handled all cases. Combined with the `--strictNullChecks` flag, this creates compile-time errors for missing cases.

Let's add exhaustiveness checking to an event system:

```typescript
[label src/exhaustive.ts]
interface UserLoginEvent {
  type: "user_login";
  userId: number;
  timestamp: Date;
}

interface UserLogoutEvent {
  type: "user_logout";
  userId: number;
  sessionDuration: number;
}

interface PageViewEvent {
  type: "page_view";
  url: string;
  referrer: string;
}

type AnalyticsEvent = UserLoginEvent | UserLogoutEvent | PageViewEvent;

function assertNever(value: never): never {
  throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
}

function processEvent(event: AnalyticsEvent): string {
  switch (event.type) {
    case "user_login":
      return `User ${event.userId} logged in at ${event.timestamp.toISOString()}`;

    case "user_logout":
      return `User ${event.userId} logged out after ${event.sessionDuration}s`;

    case "page_view":
      return `Page view: ${event.url} from ${event.referrer}`;

    default:
      return assertNever(event);
  }
}

const events: AnalyticsEvent[] = [
  { type: "user_login", userId: 42, timestamp: new Date() },
  { type: "user_logout", userId: 42, sessionDuration: 3600 },
  { type: "page_view", url: "/dashboard", referrer: "/home" }
];

events.forEach(event => {
  console.log(processEvent(event));
});
```

Run this to see exhaustive handling:

```command
npx tsx src/exhaustive.ts
```

```text
[output]
User 42 logged in at 2025-12-01T09:27:39.328Z
User 42 logged out after 3600s
Page view: /dashboard from /home
```

The `assertNever` function provides exhaustiveness checking. In the default case, TypeScript expects `event` to be `never` because all variants should be handled in the switch cases. If you add a new event type to `AnalyticsEvent` without adding a case for it, TypeScript produces a compile error showing that `event` is not `never`.

Let's see what happens when we add a new event type without handling it:

```typescript
[label src/exhaustive.ts]
...

interface PageViewEvent {
  type: "page_view";
  url: string;
  referrer: string;
}

[highlight]
interface ErrorEvent {
  type: "error";
  message: string;
  stack?: string;
}

type AnalyticsEvent = UserLoginEvent | UserLogoutEvent | PageViewEvent | ErrorEvent;
[/highlight]

function assertNever(value: never): never {
  throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
}

function processEvent(event: AnalyticsEvent): string {
  ...
}

...
```

Check what TypeScript reports:

```command
npx tsc --noEmit src/exhaustive.ts
```

```text
[output]
src/exhaustive.ts:36:27 - error TS2345: Argument of type 'ErrorEvent' is not assignable to parameter of type 'never'.

36       return assertNever(event);
                            ~~~~~


Found 1 error in src/exhaustive.ts:36
```

The error pinpoints exactly where the code needs updating. TypeScript knows that `event` could be an `ErrorEvent` in the default case, which violates the `never` type constraint. This forces you to add handling for the new variant before the code compiles.

This exhaustiveness checking becomes invaluable in large codebases where a single discriminated union might be consumed in dozens of places. Adding a new variant automatically generates compile errors at every consumption site that needs updating, turning potential runtime failures into compile-time tasks.

## Final thoughts

**Discriminated unions move you away from loose optional properties and runtime uncertainty toward precise compile-time guarantees about which variant you're working with**. This eliminates entire classes of defensive checks and invalid state combinations that would only surface as production bugs. Starting with simple two-variant unions and progressively adding complexity through nesting or generic wrappers, discriminated unions adapt to your domain's actual structure while TypeScript enforces correctness at every step.

Because discriminated unions work entirely through static analysis, there's no runtime cost beyond the JavaScript you'd write anyway. The narrowing logic happens during compilation, converting your type-safe conditionals into regular JavaScript control flow. **This is particularly valuable in complex state management, where a single mistake in handling variants can cascade into user-facing failures** that are difficult to debug without compile-time enforcement.

In practice, discriminated unions transform variant handling from error-prone manual coordination into a structured pattern where the compiler guides you. **You define clear variants with explicit discriminators once, and TypeScript ensures every consumption site handles all cases correctly**. This produces code that's not only safer but also more maintainable, as adding new variants generates immediate feedback about where updates are needed.

If you want to explore these concepts further, you can examine the [TypeScript handbook](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions), which covers additional narrowing techniques and demonstrates how discriminated unions interact with other advanced type system features to build robust applications.
