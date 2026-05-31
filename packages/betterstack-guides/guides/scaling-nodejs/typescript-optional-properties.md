# Optional Properties and Null Handling in TypeScript

TypeScript's optional properties and null handling features catch null reference errors during compile time instead of allowing them to break your application while it is running. **By marking values that may be missing or null, you force your code to handle these cases before execution.**

JavaScript treats `undefined` and `null` loosely, which often leads to bugs that slip through tests and show up in production. A property access on an undefined object, a function call on a null value, or an array operation on missing data can all cause runtime failures. **These errors are common in JavaScript because the language does not provide compile-time protection.**

TypeScript solves this problem with optional properties, union types that include `null` or `undefined`, and strict null checking that makes missing values clear in your types. **This creates code that handles edge cases by design, not by scattered defensive checks or runtime guards.**

In this guide, you'll learn:

- How optional properties prevent undefined property access errors
- The difference between `undefined`, `null`, and optional properties
- Using strict null checks to catch missing value bugs at compile time
- Building robust APIs with explicit null handling patterns

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
mkdir ts-optional-null && cd ts-optional-null
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

This initializes a `tsconfig.json` file, establishing a modern TypeScript environment. With these steps complete, you have everything needed to explore optional properties and null handling with immediate code execution through `tsx`.

## Understanding the missing value problem

JavaScript treats missing values inconsistently, using both `undefined` and `null` to represent absence. Object properties can be undefined, function parameters can be missing, and API responses can return null—but JavaScript provides no compile-time way to track which values might be absent.

This creates runtime errors when code assumes a value exists but receives `undefined` or `null` instead. Property access on undefined objects throws "Cannot read property of undefined" errors. Function calls on null values crash with "null is not a function." These bugs appear in production because JavaScript executes the code before discovering the missing values.

Let's examine a common scenario where missing values cause runtime failures:

```typescript
[label src/problem.ts]
interface User {
  name: string;
  email: string;
  phone: string;
}

function sendNotification(user: User) {
  const phoneNumber = user.phone.replace(/-/g, '');
  console.log(`Sending SMS to ${phoneNumber}`);
}

const user: User = {
  name: "Alice",
  email: "alice@example.com",
  phone: undefined as any  // Simulating missing optional data
};

sendNotification(user);
```

Run this code to see the runtime error:

```command
npx tsx src/problem.ts
```

```text
[output]
/ts-optional-null/src/problem.ts:8
  const phoneNumber = user.phone.replace(/-/g, '');
                                 ^
TypeError: Cannot read properties of undefined (reading 'replace')
```

The `sendNotification` function assumes `phone` always exists, but the user object has an undefined phone number. JavaScript executes the function and crashes when it tries to call `.replace()` on undefined. This is a classic null reference error that TypeScript's type system should prevent.

Check whether TypeScript catches this problem:

```command
npx tsc --noEmit src/problem.ts
```

TypeScript compiles successfully without errors. The type system declares `phone` as a required string, so TypeScript assumes it will always be present. The `as any` cast bypasses type checking, but even without that cast, TypeScript's default configuration wouldn't catch this missing value bug.

## Solving the problem with optional properties

Optional properties mark fields that might be absent, forcing code to check for their existence before use. The `?` syntax after a property name signals that this field may be `undefined`, making absence part of the type signature rather than a runtime surprise.

This transforms implicit assumptions about data presence into explicit type constraints. When you mark `phone` as optional, TypeScript refuses to let you access it without first verifying it exists. The compiler enforces these checks before execution, preventing null reference errors from reaching production.

Let's fix the previous example by making the phone number optional:

```typescript
[label src/problem.ts]
interface User {
  name: string;
  email: string;
[highlight]
  phone?: string;
[/highlight]
}

function sendNotification(user: User) {
  const phoneNumber = user.phone.replace(/-/g, '');
  console.log(`Sending SMS to ${phoneNumber}`);
}

const user: User = {
  name: "Alice",
  email: "alice@example.com"
};

sendNotification(user);
```

Now check what TypeScript reports:

```command
npx tsx 
```

```text
[output]
src/problem.ts:8:23 - error TS18048: 'user.phone' is possibly 'undefined'.

8   const phoneNumber = user.phone.replace(/-/g, "");
                        ~~~~~~~~~~


Found 1 error in src/problem.ts:8
```

TypeScript now catches the unsafe property access during compilation. The error indicates that `user.phone` might be undefined, so calling `.replace()` directly is unsafe. This error appears in your editor as you type, forcing you to handle the missing value case before the code can execute.

Fix the error by checking for the phone number's existence:

```typescript
[label src/problem.ts]
...
function sendNotification(user: User) {
  [highlight]
  if (user.phone) {
[/highlight]
    const phoneNumber = user.phone.replace(/-/g, '');
    console.log(`Sending SMS to ${phoneNumber}`);
  [highlight]
  } else {
    console.log('Phone number not available');
  }
  [/highlight]
}
...
```

Verify the fix:

```command
npx tsc 
```

TypeScript compiles successfully now. The `if` check narrows the type of `user.phone` from `string | undefined` to `string` within the block, allowing safe access to string methods.

### How optional property types work

Optional properties create union types that include `undefined`. When you write `phone?: string`, TypeScript internally treats this as `phone: string | undefined`. This makes absence explicit in the type system rather than allowing implicit undefined values to slip through.

Type narrowing through conditionals removes `undefined` from the union. Inside the `if (user.phone)` block, TypeScript knows the value exists because the condition checked for it. The type narrows from `string | undefined` to just `string`, enabling access to string methods without errors.

This compile-time analysis provides guarantees about value presence without runtime overhead. The generated JavaScript contains only your conditional checks—no additional type information or validation logic. TypeScript analyzes control flow during compilation and ensures you've handled undefined cases before allowing property access.

## Enabling strict null checks

TypeScript's default configuration treats `null` and `undefined` as valid values for all types, allowing them to be assigned anywhere. This permissive behavior mimics JavaScript's loose handling but defeats the purpose of compile-time null safety.

The `strictNullChecks` option changes this behavior by making `null` and `undefined` distinct types that cannot be assigned to other types without explicit union types. This forces you to handle null and undefined cases throughout your codebase, catching missing value bugs at compile time.

Enable strict null checking in your TypeScript configuration:

```typescript
[label tsconfig.json]
{
  "compilerOptions": {
    [highlight]
    "strictNullChecks": true,
    [/highlight]
    "target": "ES2022",
    "module": "ES2022",
    ...
  }
}
```

Now examine how strict null checks affect type safety:

```typescript
[label src/strict.ts]
interface Product {
  id: number;
  name: string;
  description: string | null;
}

function displayProduct(product: Product) {
  console.log(product.name.toUpperCase());
  console.log(product.description.trim());  // Error with strictNullChecks
}

const product: Product = {
  id: 1,
  name: "Laptop",
  description: null
};

displayProduct(product);
```

Check what TypeScript reports with strict null checks enabled:

```command
npx tsc --noEmit 
```

```text
[output]
src/strict.ts:9:15 - error TS18047: 'product.description' is possibly 'null'.

9   console.log(product.description.trim()); // Error with strictNullChecks
                ~~~~~~~~~~~~~~~~~~~


Found 1 error in src/strict.ts:9
```

TypeScript catches the unsafe null access because `description` is explicitly typed as `string | null`. Without strict null checks, TypeScript would allow this code to compile and crash at runtime when `description` is null.

Fix the error by handling the null case:

```typescript
[label src/strict.ts]
function displayProduct(product: Product) {
  console.log(product.name.toUpperCase());
  [highlight]
  console.log(product.description?.trim() ?? 'No description');
  [/highlight]
}
...
```

The optional chaining operator `?.` safely accesses `trim()` only if `description` is not null, and the nullish coalescing operator `??` provides a fallback value. This pattern handles null values elegantly without verbose conditionals.

## Understanding undefined vs null vs optional

TypeScript distinguishes between three ways to represent absence: `undefined`, `null`, and optional properties. While they all indicate missing values, they serve different purposes and behave differently in the type system.

Optional properties with `?` create `undefined` values. When you access a property that wasn't set, JavaScript returns `undefined`. TypeScript treats `property?: string` as `property: string | undefined`, making undefined values explicit in the type signature.

Explicit `null` values indicate intentional absence. APIs often return `null` to signal "no value exists" versus `undefined` which means "value not provided." The distinction matters for JSON serialization—JSON includes `null` but omits `undefined` properties entirely.

Here's how each approach handles absence differently:

```typescript
[label src/absence.ts]
interface UserProfile {
  username: string;
  bio?: string;              // Optional: might be undefined
  avatar: string | null;     // Explicit null: intentionally empty
}

const profile1: UserProfile = {
  username: "alice",
  avatar: null  // Explicitly no avatar
};

const profile2: UserProfile = {
  username: "bob",
  bio: "Developer",
  avatar: "avatar.jpg"
};

console.log("Profile 1 bio:", profile1.bio);        // undefined
console.log("Profile 1 avatar:", profile1.avatar);  // null
console.log("Profile 2 bio:", profile2.bio);        // "Developer"

console.log("\nJSON representation:");
console.log(JSON.stringify(profile1));
console.log(JSON.stringify(profile2));
```

Run this to see the behavioral differences:

```command
npx tsx src/absence.ts
```

```text
[output]
Profile 1 bio: undefined
Profile 1 avatar: null
Profile 2 bio: Developer

JSON representation:
{"username":"alice","avatar":null}
{"username":"bob","bio":"Developer","avatar":"avatar.jpg"}
```

The JSON output shows a critical difference: `bio` disappears completely when undefined, but `avatar: null` remains in the serialized object. This matters for API design—optional properties communicate "not provided" while explicit null communicates "intentionally empty."

For most TypeScript code, prefer optional properties over explicit `null` unions. Optional properties integrate better with object destructuring, reduce boilerplate checks, and align with JavaScript's natural behavior where missing properties return undefined.

## Building null-safe utility functions

Optional chaining and nullish coalescing enable concise null handling without verbose conditional logic. These operators work together to access nested properties safely and provide fallback values when properties are missing or null.

The optional chaining operator `?.` short-circuits evaluation when encountering null or undefined, returning undefined instead of throwing an error. The nullish coalescing operator `??` provides default values only for `null` or `undefined`, treating other falsy values like `0` or `""` as valid.

Let's build utility functions that handle nested optional properties safely:

```typescript
[label src/utilities.ts]
interface Address {
  street?: string;
  city?: string;
  country?: string;
}

interface Company {
  name: string;
  address?: Address;
}

interface Employee {
  name: string;
  company?: Company;
}

function getEmployeeCity(employee: Employee): string {
  return employee.company?.address?.city ?? 'Unknown';
}

function formatAddress(employee: Employee): string {
  const addr = employee.company?.address;
  if (!addr) return 'No address available';
  
  return [addr.street, addr.city, addr.country]
    .filter(Boolean)
    .join(', ');
}

const emp1: Employee = {
  name: "Alice",
  company: {
    name: "TechCorp",
    address: { city: "New York", country: "USA" }
  }
};

const emp2: Employee = { name: "Bob" };

console.log(getEmployeeCity(emp1));  // New York
console.log(getEmployeeCity(emp2));  // Unknown
console.log(formatAddress(emp1));    // New York, USA
console.log(formatAddress(emp2));    // No address available
```

Run this to see safe null handling in action:

```command
npx tsx src/utilities.ts
```

```text
[output]
New York
Unknown
New York, USA
No address available
```

The `getEmployeeCity` function chains through multiple optional properties without explicit null checks. If any property in the chain is undefined, the entire expression evaluates to undefined, and the `??` operator provides the fallback value.

The `formatAddress` function demonstrates a different pattern—checking for the nested object once and then safely accessing its properties. This approach works better when you need multiple properties from the same optional object.

## Final thoughts


Optional properties and strict null checking move missing value errors from runtime to compile time. **This makes the absence of a value explicit and removes an entire group of null reference bugs that often affect JavaScript apps.**

When you combine optional properties, union types with null, and operators like `?.` and `??`, you get a null-safe programming style without writing lots of defensive code. **TypeScript keeps your code safe through type narrowing while still producing fast, clean JavaScript with no extra runtime cost.**

Turning on strict null checks changes TypeScript from a simple type annotation tool into a real safety system. **It prevents many production bugs by catching problems during development.** Although you spend more time handling null cases up front, you save time later with fewer bugs and easier debugging.

To learn more about null safety patterns, see the [TypeScript handbook](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#null-and-undefined)