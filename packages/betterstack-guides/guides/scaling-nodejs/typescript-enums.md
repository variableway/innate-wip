# Understanding TypeScript Enums

TypeScript enums give you named constants that make your code self-documenting and prevent invalid values from entering your system. Instead of scattering magic strings and numbers throughout your codebase, enums create a single source of truth for related values, making your intent explicit and your code more maintainable.

While you could use string literals or const objects for grouping related values, enums provide compile-time type checking and runtime validation that catches errors before they reach production. This dual-layer protection ensures invalid values never make it past TypeScript's compiler or your application's runtime checks.

In this guide, you'll learn how string enums, numeric enums, and const enums solve real development challenges while avoiding common pitfalls.

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
mkdir ts-enums && cd ts-enums
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

This environment lets you experiment with enums and see immediate results using `tsx` for rapid iteration.

## The problem with magic values

Applications commonly use status codes, user roles, and configuration flags that appear as raw strings or numbers throughout the codebase. These magic values become error-prone when developers mistype them, inconsistent when different parts of the system use different conventions, and difficult to refactor when requirements change.

Consider this common scenario that demonstrates why magic values create problems:

```typescript
[label src/magic-values.ts]
// User management with magic strings everywhere
function checkPermission(userRole: string, action: string): boolean {
  if (userRole === 'admin') return true;
  if (userRole === 'moderator' && action === 'edit') return true;
  return false;
}

// Different parts of code use different conventions
const user1 = { role: 'admin' };
const user2 = { role: 'Admin' }; // Capital A - bug!

console.log(checkPermission(user1.role, 'edit')); // true
console.log(checkPermission(user2.role, 'edit')); // false - case mismatch!
```

Test this problematic code:

```command
npx tsx src/magic-values.ts
```

```text
[output]
true
false
```

TypeScript accepts this code without complaint because strings are valid types. The case mismatch in `user2` and the synonym in `user3` pass type checking but fail at runtime. You won't discover these bugs until users report permission errors in production.

This pattern multiplies maintenance problems as your codebase grows. Finding all instances of a role name for refactoring requires text search, which misses dynamically constructed strings. Adding new roles requires updating scattered conditional logic across multiple files. Onboarding developers need to memorize exact string values without tooling support.

## Creating type-safe constants with enums

TypeScript enums solve magic value problems by defining a set of named constants that the compiler understands and validates. String enums map names to specific string values, creating a contract that both TypeScript and your runtime code can enforce.

These named constants appear in autocomplete, generate compiler errors for typos, and make refactoring safe by providing a single definition that updates everywhere the enum is used.

Let's eliminate the magic values using string enums:

```typescript
[label src/magic-values.ts]
[highlight]
// Define valid roles as an enum
enum UserRole {
  Admin = 'admin',
  Moderator = 'moderator',
  User = 'user'
}

enum Action {
  View = 'view',
  Edit = 'edit',
  Delete = 'delete'
}
[/highlight]

// Type-safe permission checking
[highlight]
function checkPermission(userRole: UserRole, action: Action): boolean {
  if (userRole === UserRole.Admin) return true;
  if (userRole === UserRole.Moderator && action === Action.Edit) return true;
[/highlight]
  return false;
}

[highlight]
const user = { role: UserRole.Admin };
[/highlight]

[highlight]
console.log('Can edit?', checkPermission(user.role, Action.Edit));
[/highlight]

// This would cause a compile error:
// checkPermission(user.role, 'edit'); // Type error!
```

String enums create named constants where each member maps to a specific string value. `UserRole.Admin` equals `'admin'` at runtime, but TypeScript treats it as a distinct type that prevents accidental string usage.

The syntax `enum Name { Member = 'value' }` defines an enum where you explicitly specify the string value for each member. This explicit mapping keeps your API contracts stable while allowing internal refactoring of the enum member names.

Run this to see the type safety in action:

```command
npx tsx src/magic-values.ts
```

```text
[output]
Can edit? true
```

The enum approach eliminates the entire class of typo bugs. TypeScript's autocomplete suggests valid values as you type. Refactoring a role name becomes a single change to the enum definition. Your IDE can find all usages reliably because enums create semantic types, not just strings.

## Working with numeric enums for sequential values

Numeric enums assign sequential integer values automatically, making them ideal for representing ordered states, priority levels, or database status codes where the specific numbers matter less than their relative ordering.

This automatic numbering reduces boilerplate when defining sequential constants while maintaining the same type safety and refactoring benefits as string enums.

Here's how numeric enums handle ordered states efficiently:

```typescript
[label src/numeric-enums.ts]
// Numeric enum with auto-incrementing values
enum Priority {
  Low,      // 0
  Medium,   // 1
  High,     // 2
  Critical  // 3
}

// Type-safe priority comparisons
function escalateIfNeeded(currentPriority: Priority): Priority {
  if (currentPriority >= Priority.High) {
    return Priority.Critical;
  }
  return currentPriority + 1;
}

const taskPriority = Priority.Medium;
const escalated = escalateIfNeeded(taskPriority);

console.log('Original:', Priority[taskPriority]); // Reverse mapping
console.log('Escalated:', Priority[escalated]);
```

Numeric enums start at 0 by default and increment automatically, but you can specify starting values or individual member values. The syntax `enum Name { Member = value }` lets you set specific numbers for HTTP status codes or other standardized numeric constants.

One unique feature of numeric enums is reverse mapping—you can look up the name from the number using `EnumName[value]`. This proves useful for debugging or logging when you need to display human-readable enum names.

Execute this to see numeric enums in action:

```command
npx tsx src/numeric-enums.ts
```

```text
[output]
Original: Medium
Escalated: High
```

Numeric enums let you perform comparisons and arithmetic that would be impossible with string enums. The sequential numbering creates natural ordering for priority systems, state machines, or any scenario where the relative position of values matters more than their specific representation.

## Building configuration systems with const enums

Const enums provide the type safety of regular enums while generating zero runtime code. The TypeScript compiler inlines const enum values directly at usage sites, eliminating the JavaScript object that normal enums create.

This optimization matters for library code, large applications, or any scenario where bundle size and runtime performance matter. You get enum benefits at compile time without any runtime overhead.

Let's create a configuration system using const enums:

```typescript
[label src/const-enums.ts]
// Const enum for log levels
const enum LogLevel {
  Debug = 0,
  Info = 1,
  Warn = 2,
  Error = 3
}

class Logger {
  private minLevel = LogLevel.Info;

  log(level: LogLevel, message: string): void {
    if (level >= this.minLevel) {
      console.log(`[${level}] ${message}`);
    }
  }
}

const logger = new Logger();

logger.log(LogLevel.Debug, 'This won\'t show');
logger.log(LogLevel.Info, 'Application started');
logger.log(LogLevel.Error, 'Critical error');
```

Const enums use the `const enum` syntax instead of just `enum`. During compilation, TypeScript replaces every const enum usage with its literal value. The line `config.isFeatureEnabled(FeatureFlag.DarkMode)` becomes `config.isFeatureEnabled("dark_mode")` in the compiled JavaScript, with no enum object generated at all.

This inlining means you cannot iterate over const enum members or use reverse mapping. The tradeoff is worth it when you need the smallest possible bundle size and fastest runtime performance.

Run this to see const enums in action:

```command
npx tsx src/const-enums.ts
```

```text
[output]
[1] Application started
[3] Critical error
```

The compiled JavaScript contains no trace of the `FeatureFlag` or `LogLevel` enums—just raw string and number literals where you used them. Your code maintains type safety during development while producing the leanest possible JavaScript for production.

## Choosing the right enum type

Different enum types serve different purposes, and choosing the right one depends on your specific requirements for runtime behavior, bundle size, and API design.

Understanding these tradeoffs helps you select the appropriate enum type for each situation rather than defaulting to one approach everywhere.

Here's a practical comparison showing when to use each enum type:

```typescript
[label src/enum-comparison.ts]
// String enums: Best for API contracts
enum ApiStatus {
  Pending = 'PENDING',
  Completed = 'COMPLETED',
  Failed = 'FAILED'
}

function getJobStatus(): { status: ApiStatus } {
  return { status: ApiStatus.Completed };
}

// Numeric enums: Best for ordered states
enum Priority {
  Low = 0,
  Medium = 1,
  High = 2
}

function canEscalate(priority: Priority): boolean {
  return priority < Priority.High;
}

// Const enums: Best for internal constants
const enum CacheKey {
  UserProfile = 'user_profile',
  Settings = 'settings'
}

function getCacheKey(key: CacheKey): string {
  return `app:${key}`;
}

// Test each approach
console.log('Status:', getJobStatus().status);
console.log('Can escalate?', canEscalate(Priority.Low));
console.log('Cache key:', getCacheKey(CacheKey.UserProfile));
```

String enums shine when the enum values cross API boundaries or get stored in databases. The explicit string values create stable contracts that remain readable in JSON and don't change if you reorder enum members.

Numeric enums excel at representing ordered sequences or bit flags where mathematical operations make sense. The automatic numbering reduces verbosity while maintaining type safety.

Const enums fit internal constants that never need reflection or serialization. They provide enum benefits without runtime cost, perfect for configuration keys, internal state codes, or optimization levels.

Run this comparison:

```command
npx tsx src/enum-comparison.ts
```

```text
[output]
Status: COMPLETED
Can escalate? true
Cache key: app:user_profile
```

The right choice depends on your use case: string enums for external APIs, numeric enums for ordered states or flags, and const enums for internal constants where bundle size matters. You can mix enum types in the same project based on each specific need.

## Final thoughts

Enums replace magic values with named constants that TypeScript validates at compile time and your application can verify at runtime. This dual protection prevents entire categories of bugs that stem from typos, case mismatches, or invalid values.

String enums provide explicit values perfect for API contracts, numeric enums offer automatic sequencing for ordered states, and const enums deliver zero-runtime-cost type safety for internal constants. Each type solves specific problems without compromising on type safety.

Using enums transforms scattered magic values into centralized definitions that make your code self-documenting and refactoring-safe. Your development tools gain the context to provide accurate autocomplete and catch errors before they reach production.

Explore the [TypeScript handbook on enums](https://www.typescriptlang.org/docs/handbook/enums.html) to learn about advanced patterns like heterogeneous enums, ambient enums, and const enum preserving for library development.