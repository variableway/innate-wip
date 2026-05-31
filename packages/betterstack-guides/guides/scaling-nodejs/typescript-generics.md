# Understanding Generics in TypeScript

For many developers new to TypeScript, generics can seem intimidating with their
angle brackets and type parameters. However, once understood, they become an
indispensable tool in your TypeScript toolkit.

In this comprehensive guide, we'll break down TypeScript generics from the
ground up, showing you how and when to use them effectively.

[ad-logs]

## What are TypeScript generics?

At their core, generics in TypeScript are a way to create components that can
work with a variety of data types rather than being limited to a single one.
They act as placeholders for types that you specify later when using the code.

Think of generics as a way to tell TypeScript: "I don't know exactly what type
this will be yet, but whatever type goes in should also come out." This
flexibility is what makes generics so powerful.

Let's start with a simple example to understand why we need generics. Imagine
you want to create a function that returns the first element of an array:

```typescript
function getFirstElement(arr: any[]): any {
  return arr[0];
}

const numbers = [1, 2, 3];
const firstNumber = getFirstElement(numbers);

const names = ["Alice", "Bob", "Charlie"];
const firstName = getFirstElement(names);
```

While this function works, it has a significant drawback: you lose type
information. TypeScript doesn't know that `firstNumber` should be a number and
`firstName` should be a string. Both are typed as `any`, which defeats much of
the purpose of using TypeScript in the first place.

This is where generics come in:

```typescript
function getFirstElement<T>(arr: T[]): T {
  return arr[0];
}

const numbers = [1, 2, 3];
const firstNumber = getFirstElement(numbers); // TypeScript knows this is a number

const names = ["Alice", "Bob", "Charlie"];
const firstName = getFirstElement(names); // TypeScript knows this is a string
```

With this generic function, TypeScript preserves the type information. It
understands that when you pass an array of numbers, you get a number back, and
when you pass an array of strings, you get a string back. This is the power of
generics: they maintain type safety while allowing for code reuse.

### The DRY principle and generics

The DRY principle is fundamental to writing maintainable code. Without generics,
you might find yourself writing multiple versions of the same function for
different types:

```typescript
function getFirstNumberElement(arr: number[]): number {
  return arr[0];
}

function getFirstStringElement(arr: string[]): string {
  return arr[0];
}

// And so on for each type...
```

This approach quickly becomes unmaintainable. Generics solve this problem
elegantly by letting you write the logic once and apply it to any type.

The syntax for generics involves angle brackets (`<>`) and type parameters. By
convention, single-letter type parameters are commonly used, with `T` (for
"Type") being the most common for a single parameter:

```typescript
function example<T>(arg: T): T {
  return arg;
}
```

When you need multiple type parameters, it's common to use sequential letters
like `T`, `U`, `V`, or more descriptive names for clarity:

```typescript
function pair<K, V>(key: K, value: V): [K, V] {
  return [key, value];
}
```

For more specialized cases, you might use more descriptive names:

```typescript
function createStore<ItemType, KeyType>(
  items: ItemType[],
  getKey: (item: ItemType) => KeyType
) {
  // Implementation...
}
```

## Basic generic syntax and usage

Now that you understand the fundamentals, let's dive deeper into how generics
are used in different contexts.

### Generic functions

The most common use of generics is in functions. Here's a simple function that
returns whatever is passed to it:

```typescript
function identity<T>(arg: T): T {
  return arg;
}

// Usage
const num = identity(42);        // TypeScript infers type 'number'
const str = identity("hello");   // TypeScript infers type 'string'
const bool = identity(true);     // TypeScript infers type 'boolean'
```

You'll notice how TypeScript automatically infers the type based on what you
pass to the function. You can also explicitly specify the type:

```typescript
const num = identity<number>(42);
```

Let's look at another useful example - a function that reverses an array:

```typescript
function reverseArray<T>(array: T[]): T[] {
  return [...array].reverse();
}

const numbers = reverseArray([1, 2, 3, 4]);             // Type: number[]
const strings = reverseArray(["a", "b", "c"]);          // Type: string[]
const mixed = reverseArray([1, "two", 3, "four"]);      // Type: (string | number)[]
```

### Generic interfaces

Interfaces in TypeScript can also be generic, allowing you to create flexible
but type-safe object shapes:

```typescript
interface Container<T> {
  value: T;
  getValue(): T;
}

// Implementation
class NumberContainer implements Container<number> {
  constructor(public value: number) {}

  getValue(): number {
    return this.value;
  }
}

const container = new NumberContainer(42);
const value = container.getValue();  // Type: number
```

Generic interfaces are particularly useful for defining data structures:

```typescript
interface Pair<K, V> {
  key: K;
  value: V;
}

const pair: Pair<string, number> = {
  key: "age",
  value: 30
};

// You can use different types
const anotherPair: Pair<number, boolean> = {
  key: 1,
  value: true
};
```

In the real-world, generic interfaces are commonly used to represent API
responses such as:

```typescript
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
  timestamp: Date;
}

// User data type
interface User {
  id: number;
  name: string;
  email: string;
}

// A response containing user data
const userResponse: ApiResponse<User> = {
  data: {
    id: 1,
    name: "Jane Doe",
    email: "jane@example.com"
  },
  status: 200,
  message: "Success",
  timestamp: new Date()
};
```

### Generic classes

Classes can also leverage generics to create reusable, type-safe components:

```typescript
class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }
}

// Create a stack of numbers
const numberStack = new Stack<number>();
numberStack.push(1);
numberStack.push(2);
numberStack.push(3);

const topNumber = numberStack.pop();  // Type: number | undefined

// Create a stack of strings
const stringStack = new Stack<string>();
stringStack.push("hello");
stringStack.push("world");

const topString = stringStack.pop();  // Type: string | undefined
```

Here's another example of a generic class that implements a simple key-value
store:

```typescript
class KeyValueStore<K, V> {
  private store = new Map<K, V>();

  set(key: K, value: V): void {
    this.store.set(key, value);
  }

  get(key: K): V | undefined {
    return this.store.get(key);
  }

  has(key: K): boolean {
    return this.store.has(key);
  }

  delete(key: K): boolean {
    return this.store.delete(key);
  }
}

// Create a store with string keys and number values
const userAges = new KeyValueStore<string, number>();
userAges.set("Alice", 30);
userAges.set("Bob", 25);

const aliceAge = userAges.get("Alice");  // Type: number | undefined
```

### Type inference with generics

TypeScript's type inference works exceptionally well with generics, often
allowing you to omit explicit type parameters:

```typescript
function identity<T>(arg: T): T {
  return arg;
}

// No need to specify <number> - TypeScript infers it
const num = identity(42);

// You can specify it explicitly if needed
const str = identity<string>("hello");
```

For functions with multiple type parameters, TypeScript tries to infer all types
from the arguments:

```typescript
function map<T, U>(array: T[], fn: (item: T) => U): U[] {
  return array.map(fn);
}

const numbers = [1, 2, 3, 4];
const doubled = map(numbers, n => n * 2);            // Type: number[]
const stringified = map(numbers, n => n.toString()); // Type: string[]
```

## Understanding constraints and boundaries

Sometimes you need to restrict what types can be used with your generics.
TypeScript allows you to set constraints on type parameters using the `extends`
keyword.

The `extends` keyword allows you to specify that a type parameter must be a
subtype of a specific type:

```typescript
function logProperty<T extends { name: string }>(obj: T): void {
  console.log(obj.name);  // Safe! We know 'obj' has a 'name' property
}

// These work
logProperty({ name: "Alice", age: 30 });
logProperty({ name: "Book", pages: 250 });

// This would cause a compile-time error
logProperty({ age: 30 });  // Error: Property 'name' is missing
```

![Type error](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/4fc0b854-a835-42fe-ea5b-22b13b6bee00/lg2x =1442x525)

### Ensuring objects have certain properties

A common use case for constraints is to ensure that objects have the properties
your function needs:

```typescript
function getLength<T extends { length: number }>(item: T): number {
  return item.length;
}

// All these work because they have a 'length' property
const stringLength = getLength("hello");        // Works with strings
const arrayLength = getLength([1, 2, 3]);       // Works with arrays
const objectLength = getLength({ length: 10 }); // Works with objects that have a length

// This would fail
// getLength(123);  // Error: Number doesn't have a 'length' property
```

You can also apply different constraints to multiple type parameters:

```typescript
function merge
  T extends object,
  U extends object
>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 };
}

const result = merge(
  { name: "Alice" },
  { age: 30 }
);

// Result type is { name: string, age: number }
console.log(result.name);  // "Alice"
console.log(result.age);   // 30

// This would fail
// merge("not an object", { age: 30 });  // Error: Argument of type 'string' is not assignable to parameter of type 'object'
```

### Default type parameters

TypeScript allows you to specify default types for generic parameters:

```typescript
interface ApiRequest<T = any> {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: T;
}

// No need to specify the type parameter
const getRequest: ApiRequest = {
  endpoint: '/users',
  method: 'GET'
};

// Specify a type for the data
const postRequest: ApiRequest<{ name: string; email: string }> = {
  endpoint: '/users',
  method: 'POST',
  data: {
    name: 'Alice',
    email: 'alice@example.com'
  }
};
```

Default type parameters are useful when a generic parameter is optional or has a
sensible default.

## Advanced generic patterns

Once you're comfortable with basic generics, you can explore more advanced
patterns. As we've seen in previous examples, you can use multiple type
parameters when needed:

```typescript
function combine<T, U, R>(
  a: T,
  b: U,
  combiner: (a: T, b: U) => R
): R {
  return combiner(a, b);
}

const result = combine(
  "Hello",
  5,
  (a, b) => `${a} repeated ${b} times: ${a.repeat(b)}`
);

// TypeScript infers result as string
console.log(result);  // "Hello repeated 5 times: HelloHelloHelloHelloHello"
```

### Mapped types with generics

Mapped types let you create new types by transforming properties of existing
types:

```typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P]
};

interface User {
  id: number;
  name: string;
  email: string;
}

const user: User = {
  id: 1,
  name: "Alice",
  email: "alice@example.com"
};

const readonlyUser: Readonly<User> = user;

// This would cause an error
// readonlyUser.name = "Bob";  // Error: Cannot assign to 'name' because it is a read-only property
```

Another common mapped type is `Partial<T>`, which makes all properties optional:

```typescript
type Partial<T> = {
  [P in keyof T]?: T[P]
};

interface User {
  id: number;
  name: string;
  email: string;
  address: string;
}

// Without Partial, all properties would be required
function updateUser(userId: number, updates: Partial<User>) {
  // Update only the provided fields
}

// We can pass just the fields we want to update
updateUser(1, {
  name: "New Name"
});
```

### Conditional types with generics

Conditional types allow you to create types that depend on conditions:

```typescript
type NonNullable<T> = T extends null | undefined ? never : T;

// Examples
type A = NonNullable<string>;        // string
type B = NonNullable<string | null>; // string
type C = NonNullable<null>;          // never

// A more practical example
function process<T>(value: T): NonNullable<T> {
  if (value === null || value === undefined) {
    throw new Error("Value cannot be null or undefined");
  }
  return value as NonNullable<T>;
}

const result1 = process("hello");  // Type: string
const result2 = process(42);       // Type: number
// This would throw at runtime
// const result3 = process(null);
```

### Generic type inference in action

TypeScript can infer the return type of a function based on its implementation
and generic constraints:

```typescript
[label type-inference-advanced.ts]
function prop<T, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}

const user = {
  name: "Alice",
  age: 30,
  isAdmin: true
};

const name = prop(user, "name");    // TypeScript infers 'string'
const age = prop(user, "age");      // TypeScript infers 'number'
const isAdmin = prop(user, "isAdmin");  // TypeScript infers 'boolean'

// This would cause a compile-time error
// const invalid = prop(user, "invalid");  // Error: 'invalid' is not assignable to parameter of type 'keyof { name: string; age: number; isAdmin: boolean; }'
```

### Using generics with API responses

Generics are particularly useful when working with API responses:

```typescript
async function fetchApi<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

interface User {
  id: number;
  name: string;
  email: string;
}

// Now we can fetch with type safety
async function getUser(id: number) {
  const user = await fetchApi<User>(`/api/users/${id}`);

  // TypeScript knows 'user' is of type 'User'
  console.log(user.name);

  return user;
}
```

## When to use generics (and when not to)

Generics are powerful, but they're not always necessary. Here are some
guidelines:

**Use generics when:**

- You need to preserve type information across a function or class.
- You're building reusable components that should work with multiple types.
- You want to enforce relationships between types (input/output).

**Avoid generics when:**

- A simple type will do (e.g., when you're working with a specific type).
- The `any` type is genuinely appropriate (rare, but it happens).

A common progression in TypeScript is to start with `any` types and gradually
introduce more type safety with generics:

```typescript
function processData(data: any): any {
  return {
    processed: true,
    data
  };
}

const result = processData("some data");
// No type safety - TypeScript doesn't know what's in 'result'
```

Here's how you might refactor this using generics:

```typescript
function processData<T>(data: T): { processed: boolean; data: T } {
  return {
    processed: true,
    data
  };
}

const result = processData("some data");
console.log(result.data.toUpperCase());  // Safe!
```

## Final thoughts

TypeScript generics provide a powerful way to build reusable, type-safe
components that work with a variety of data types. They help you follow the DRY
principle while maintaining the type safety that makes TypeScript so valuable.

While generics can seem complex at first, they become an indispensable tool once
you understand their patterns and applications. Start by using them in simple
functions and gradually work your way up to more complex patterns as you become
comfortable with the syntax.

Thanks for reading!
