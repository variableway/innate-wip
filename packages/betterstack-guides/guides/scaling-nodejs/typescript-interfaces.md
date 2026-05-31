# Interfaces in TypeScript

Interfaces in TypeScript define contracts for object shapes, specifying what properties and methods an object must have without dictating how they're implemented. **They provide compile-time type checking that ensures objects conform to expected structures, catching shape mismatches before code execution.**

Unlike classes that generate runtime JavaScript code, interfaces exist purely at the type level. **They disappear during compilation, leaving zero footprint in the generated JavaScript while providing complete type safety during development.** This makes them ideal for describing data structures, API contracts, and component props without runtime overhead.

TypeScript's structural type system means any object matching an interface's shape satisfies that interface, regardless of explicit declarations. **This "duck typing" approach differs from nominal typing in languages like Java, enabling flexible composition patterns while maintaining type safety.**

In this guide, you'll learn:

* How interfaces define object shapes and enforce type contracts
* The difference between interfaces and type aliases
* Extending interfaces to build complex type hierarchies
* Using interfaces for function signatures and class contracts

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
mkdir ts-interfaces && cd ts-interfaces
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

This initializes a `tsconfig.json` file, establishing a modern TypeScript environment. With these steps complete, you have everything needed to explore interfaces with immediate code execution through `tsx`.

## Understanding the shape mismatch problem

JavaScript functions frequently receive objects as parameters, expecting specific properties to exist with certain types. Without type checking, functions blindly access properties that might be missing, misspelled, or contain wrong value types—bugs that only surface at runtime when the code executes.

These shape mismatches cause "Cannot read property of undefined" errors, unexpected type coercion, and silent failures where wrong data propagates through your application. The calling code assumes one object structure while the function expects another, and JavaScript provides no mechanism to catch this mismatch before execution.

Let's examine a typical scenario where object shape violations cause runtime failures:

```typescript
[label src/problem.ts]
function createUser(user) {
  console.log(`Creating user: ${user.name}`);
  console.log(`Email: ${user.email}`);
  console.log(`Age: ${user.age}`);
  return { id: Math.random(), ...user };
}

// Correct shape
const validUser = createUser({
  name: "Alice",
  email: "alice@example.com",
  age: 30
});

// Missing property - no error!
const invalidUser = createUser({
  name: "Bob",
  email: "bob@example.com"
});

// Wrong property name - no error!
const typoUser = createUser({
  name: "Charlie",
  emial: "charlie@example.com",  // Typo in 'email'
  age: 25
});

console.log(validUser);
```

Run this code to see the problems:

```command
npx tsx src/problem.ts
```

```text
[output]
Creating user: Alice
Email: alice@example.com
Age: 30
Creating user: Bob
Email: bob@example.com
Age: undefined
Creating user: Charlie
Email: undefined
Age: 25
{
  id: 0.9949918257484061,
  name: 'Alice',
  email: 'alice@example.com',
  age: 30
}
```

The function silently handles missing and misspelled properties by outputting `undefined`. JavaScript executes without complaint, but the data corruption manifests later when other code relies on these properties having valid values.

Check whether TypeScript catches these problems:

```command
npx tsc --noEmit src/problem.ts
```

TypeScript compiles successfully without errors because the function parameter has implicit `any` type. The compiler treats the parameter as "anything goes," providing no protection against shape mismatches.

## Solving shape problems with interfaces

Interfaces define the exact shape an object must have, specifying required properties and their types. When you declare a parameter as an interface type, TypeScript verifies that passed objects contain all required properties with correct types, catching shape violations during compilation.

This transforms implicit assumptions about object structure into explicit contracts. The interface becomes documentation that's enforced by the compiler, preventing objects with wrong shapes from reaching your functions.

Let's fix the previous example with an interface:

```typescript
[label src/problem.ts]
[highlight]
interface User {
  name: string;
  email: string;
  age: number;
}
[/highlight]

[highlight]
function createUser(user: User) {
[/highlight]
  console.log(`Creating user: ${user.name}`);
  console.log(`Email: ${user.email}`);
  console.log(`Age: ${user.age}`);
  return { id: Math.random(), ...user };
}

....
```

Now check what TypeScript reports:

```command
npx tsc --noEmit src/problem.ts
```

```text
[output]
src/problem.ts:21:32 - error TS2345: Argument of type '{ name: string; email: string; }' is not assignable to parameter of type 'User'.
  Property 'age' is missing in type '{ name: string; email: string; }' but required in type 'User'.

21 const invalidUser = createUser({
                                  ~
22   name: "Bob",
   ~~~~~~~~~~~~~~
23   email: "bob@example.com",
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~
24 });
   ~

  src/problem.ts:4:3
    4   age: number;
        ~~~
    'age' is declared here.

src/problem.ts:29:3 - error TS2561: Object literal may only specify known properties, but 'emial' does not exist in type 'User'. Did you mean to write 'email'?

29   emial: "charlie@example.com", // Typo in 'email'
     ~~~~~


Found 2 errors in the same file, starting at: src/problem.ts:21
```

TypeScript now catches both shape violations at compile time. The first error identifies the missing `age` property with a precise message showing exactly what's missing. The second error detects the typo and even suggests the correct property name. These errors appear in your editor as you type, preventing shape mismatches from ever reaching production.

### How interface type checking works

TypeScript uses structural typing to verify interface conformance. When you pass an object to a function expecting an interface, the compiler checks that the object has all required properties with compatible types. The object can have additional properties—TypeScript only cares that it has at least what the interface requires.

This differs from nominal typing where explicit declarations matter. In TypeScript, you don't need to declare that an object implements an interface. If the object has the right shape, it satisfies the interface automatically:

```typescript
interface Point {
  x: number;
  y: number;
}

function distance(p: Point): number {
  return Math.sqrt(p.x * p.x + p.y * p.y);
}

// Works without explicit declaration
const point = { x: 3, y: 4 };
console.log(distance(point)); // Valid
```

The `point` object never mentions the `Point` interface, but TypeScript accepts it because the structure matches. This structural approach enables flexible composition while maintaining type safety through compile-time shape verification.

## Extending interfaces for composition

Interfaces support extension through the `extends` keyword, enabling composition of complex types from simpler building blocks. An interface can extend one or multiple interfaces, inheriting all their properties while adding new ones. This creates type hierarchies that mirror domain relationships without code duplication.

Extension works additively—the derived interface requires all properties from base interfaces plus any newly declared properties. This makes it impossible to violate base interface contracts while allowing specialization.

Let's build a user system with interface extension:

```typescript
[label src/extension.ts]
interface Person {
  name: string;
  email: string;
}

interface Employee extends Person {
  employeeId: string;
  department: string;
}

interface Manager extends Employee {
  teamSize: number;
  reports: string[];
}

function sendEmail(person: Person) {
  console.log(`Sending email to ${person.name} at ${person.email}`);
}

function assignTask(employee: Employee) {
  console.log(`Assigning task to ${employee.name} in ${employee.department}`);
}

const manager: Manager = {
  name: "Alice",
  email: "alice@example.com",
  employeeId: "E123",
  department: "Engineering",
  teamSize: 5,
  reports: ["Bob", "Charlie"]
};

sendEmail(manager);      // Manager is also a Person
assignTask(manager);     // Manager is also an Employee
console.log("Team size:", manager.teamSize);
```

Run this to see interface hierarchy in action:

```command
npx tsx src/extension.ts
```

```text
[output]
Sending email to Alice at alice@example.com
Assigning task to Alice in Engineering
Team size: 5
```

The `Manager` interface extends `Employee`, which extends `Person`, creating a three-level hierarchy. A `Manager` object satisfies all three interfaces because it contains all required properties from the chain. This enables polymorphic function calls—`sendEmail` accepts any `Person`, so it works with `Employee` and `Manager` objects too.

Multiple interface extension enables mixing behaviors:

```typescript
interface Timestamped {
  createdAt: Date;
  updatedAt: Date;
}

interface Identifiable {
  id: string;
}

interface User extends Person, Timestamped, Identifiable {
  role: string;
}
```

The `User` interface combines properties from three separate interfaces, creating a composite type without manually redefining shared properties.

## Using interfaces for function signatures

Interfaces describe more than object shapes—they can define function signatures, creating contracts for callbacks, event handlers, and higher-order functions. This enables type-safe function parameters where the structure of the function itself is part of the type contract.

Function signature interfaces specify parameter types and return types without implementation. Any function matching this signature satisfies the interface, enabling polymorphic function passing with full type safety.

Let's build a data processing pipeline with function interfaces:

```typescript
[label src/functions.ts]
interface Transformer {
  (input: string): string;
}

interface Validator {
  (input: string): boolean;
}

interface Processor {
  transform: Transformer;
  validate: Validator;
}

const uppercase: Transformer = (input) => input.toUpperCase();
const lowercase: Transformer = (input) => input.toLowerCase();

const notEmpty: Validator = (input) => input.length > 0;
const isEmail: Validator = (input) => input.includes("@");

function processData(data: string, processor: Processor): string | null {
  if (!processor.validate(data)) {
    return null;
  }
  return processor.transform(data);
}

const emailProcessor: Processor = {
  transform: lowercase,
  validate: isEmail
};

console.log(processData("USER@EXAMPLE.COM", emailProcessor));
console.log(processData("invalid", emailProcessor));
```

Run the function interface example:

```command
npx tsx src/functions.ts
```

```text
[output]
user@example.com
null
```

The `Transformer` and `Validator` interfaces define function shapes, while `Processor` combines them into an object interface. This creates composable processing logic where any function matching the signature works, regardless of implementation details.

Function interfaces enable powerful abstraction patterns in event systems and middleware:

```typescript
interface EventHandler<T> {
  (event: T): void;
}

interface ClickEvent {
  x: number;
  y: number;
}

const handleClick: EventHandler<ClickEvent> = (event) => {
  console.log(`Clicked at ${event.x}, ${event.y}`);
};
```

This pattern appears throughout TypeScript's standard library and enables type-safe callback registration without sacrificing flexibility.

## Final thoughts
Interfaces transform implicit assumptions about object shapes into explicit compile-time contracts, catching structure mismatches during development rather than production. **They scale from simple property definitions to complex type hierarchies through extension and composition.**

TypeScript's structural type system makes interfaces flexible: any object with the right shape satisfies an interface regardless of explicit declarations. **This enables duck typing with compile-time guarantees while still preserving static type safety.**

Interfaces operate entirely at compile time, generating zero runtime code while providing complete type checking during development. **This makes them ideal for performance-critical applications where type safety matters but runtime overhead is unacceptable.**

Explore the [TypeScript handbook](https://www.typescriptlang.org/docs/handbook/2/objects.html) to learn more about advanced interface patterns. **You’ll see how interfaces integrate with classes, generics, and utility types to create robust type systems.**