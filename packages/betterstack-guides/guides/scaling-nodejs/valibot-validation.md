# Valibot: The Complete Guide to Data Validation

When building a web app, you often need to make sure the data you’re working with is valid—whether it’s coming from a form, an API, or a file. That’s where [Valibot](https://github.com/fabian-hiller/valibot) comes in.  

Valibot is a small and fast JavaScript/TypeScript library that helps you define rules for your data and check if it meets them. Even though it’s lightweight, it’s packed with features like custom validation, schema building, and great TypeScript support.

This article shows you how to build a validation service for your JavaScript app using Valibot. 

[ad-logs]

## Prerequisites

Before you start, make sure you have [Node.js](https://nodejs.org/en/download/) and `npm` installed on your computer. You should also be familiar with basic JavaScript/TypeScript and understand the importance of data validation for your applications.

## Getting started with Valibot

To try out what you'll learn, create a new project. Open your terminal and run these commands:

```command
mkdir valibot-validation && cd valibot-validation
```

```command
npm init -y
```

Now install Valibot:

```command
npm install valibot
```

Create a file called `index.js` in your project folder and add this code:

```javascript
[label index.js]
import * as v from 'valibot';

// Create a simple schema and validate some data
const personSchema = v.object({ name: v.string(), age: v.number() });

console.log(v.parse(personSchema, { name: "Jane", age: 30 }));
```
This example defines a simple schema using `v.object()` with two fields: `name` (a string) and `age` (a number).  

Then, `v.parse()` checks an object against the schema. If the object matches, it returns the validated data.

![Valibot validation flow diagram showing raw input data being processed through a schema validator, resulting in either validated typed data with success status or validation errors with detailed issue messages](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/2b7f2b8d-c142-45d9-6d60-dcca2e8c3e00/public =2460x834)


Save this file and run it with the following command:

```command
node index.js
```

You should see this output:

```text
[output]
{ name: 'Jane', age: 30 }
```

You've now created your first validation schema and validated data against it. The validated data is returned as-is when it matches the schema.


## Handling validation errors

In the last example, the data matched the schema and was accepted. But in real-world apps, users often send invalid data. Let's see how Valibot handles these cases.

Update your `index.js` with this code:

```javascript
[label index.js]
import * as v from 'valibot';

const personSchema = v.object({ name: v.string(), age: v.number() });

// Try validating invalid data
[highlight]
try {
  console.log(v.parse(personSchema, { name: "Jane", age: "thirty" }));
} catch (error) {
  console.error('Validation error:', error);
}
[/highlight]
```

This tries to validate an object where `age` is a string instead of a number.  
Since the data doesn't match the schema, Valibot throws a `ValiError` that you can catch and log.

Save the file and run it:

```command
node index.js
```

You should see an error like:

```text
[output]
Validation error: ValiError: Invalid type: Expected number but received "thirty"
    at Module.parse (path/to/valibot/index.js:...)
    ...
{
  issues: [
    {
      kind: 'schema',
      type: 'number',
      input: 'thirty',
      expected: 'number',
      received: '"thirty"',
      message: 'Invalid type: Expected number but received "thirty"',
      path: [...]
    }
  ]
}
```

When validation fails, Valibot throws an error with a clear message.  
The `issues` property gives more structured details about what went wrong, including the expected type, the received value, and where in the data the problem happened.

## Adding validation rules

So far, you've validated that values are the correct type (string, number), but real applications need more detailed validation. For example, you might want to ensure:

- A username is at least 3 characters long
- An age is a positive number
- An email address has the correct format

Valibot lets you add these rules to your schemas using the `pipe` function. Let's modify our previous example:

```javascript
[label index.js]
import * as v from 'valibot';

[highlight]
// Create a person schema with validation rules
const personSchema = v.object({
  name: v.pipe(
    v.string(),
    v.minLength(3, 'Name must be at least 3 characters')
  ),
  age: v.number()
});

// Try with valid data
console.log(v.parse(personSchema, { name: "Jane", age: 30 }));

// Try with invalid data
try {
  console.log(v.parse(personSchema, { name: "Jo", age: 30 }));
} catch (error) {
  console.log('Validation error:', error.issues[0].message);
}
[/highlight]
```

Here, you've enhanced our previous `personSchema` by adding the `v.pipe()` function with a length validator. The pipe function lets you chain validators together:

1. `v.string()` - First check that the value is a string
2. `v.minLength(3)` - Then checks that the string is at least 3 characters long

Save this file and run it with:

```command
node index.js
```

You should see this output:

```text
[output]
{ name: 'Jane', age: 30 }
Validation error: Name must be at least 3 characters
```

Now, let's add more validation rules to create a complete user schema:

```javascript
[label index.js]
import * as v from 'valibot';

// Create a person schema with more validation rules
const personSchema = v.object({
  name: v.pipe(
    v.string('Name must be a string'),
    v.minLength(3, 'Name must be at least 3 characters'),
[highlight]
    v.maxLength(20, 'Name cannot exceed 20 characters')
[/highlight]
  ),
[highlight]
  email: v.pipe(
    v.string('Email must be a string'),
    v.email('Must be a valid email address')
  ),
  age: v.pipe(
    v.number('Age must be a number'),
    v.minValue(18, 'Must be at least 18 years old')
  )
[/highlight]
});

[highlight]
// Try with valid data
const validPerson = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  age: 25
};

console.log('Valid person:', v.parse(personSchema, validPerson));

// Try with invalid data
try {
  const invalidPerson = {
    name: 'Jo',
    email: 'not-an-email',
    age: 16
  };
  v.parse(personSchema, invalidPerson);
} catch (error) {
  console.log('Validation errors:');
  error.issues.forEach(issue => {
    console.log(`- ${issue.path.map(p => p.key).join('.')}: ${issue.message}`);
  });
}
[/highlight]
```

You've expanded the schema to include:
- A maximum length for the name
- Email validation using the built-in `email()` validator
- Age validation to ensure users are at least 18 years old

You're also demonstrating how to display all validation errors simultaneously, which is particularly helpful for form validation in real-world applications.

Save the updated file and rerun it:

```command
node index.js
```

You should see this output:

```text
[output]
Valid person: { name: 'Jane Doe', email: 'jane@example.com', age: 25 }
Validation errors:
- name: Name must be at least 3 characters
- email: Must be a valid email address
- age: Must be at least 18 years old
```

Valibot collects all validation errors, not just the first one it encounters. This is helpful when validating form data, as it allows you to show users all the problems they need to fix at once.

## Creating a validation service

Currently, all our validation resides within the main file. To keep things organized and scalable, it’s a good idea to move validation into its own module. This way, your schemas and validation functions remain separate from the rest of your app logic, making them easier to manage.


Let's create a separate file for our validation logic. First, make a new file called `validator.js` with the following:

```javascript
[label validator.js]
import * as v from 'valibot';

// Define our person schema
const personSchema = v.object({
  name: v.pipe(
    v.string('Name must be a string'),
    v.minLength(3, 'Name must be at least 3 characters'),
    v.maxLength(20, 'Name cannot exceed 20 characters')
  ),
  email: v.pipe(
    v.string('Email must be a string'),
    v.email('Must be a valid email address')
  ),
  age: v.pipe(
    v.number('Age must be a number'),
    v.minValue(18, 'Must be at least 18 years old')
  )
});

// Create a function to validate a person
function validatePerson(data) {
  try {
    // Validate against our schema
    const validatedData = v.parse(personSchema, data);
    return { data: validatedData, success: true };
  } catch (error) {
    // Return validation errors
    return { 
      success: false, 
      errors: error.issues.map(issue => ({
        field: issue.path.map(p => p.key).join('.'),
        message: issue.message
      }))
    };
  }
}

export { validatePerson };
```

The validation service wraps the schema and parsing logic in a function that returns a consistent result structure. When validation succeeds, it returns an object with `success: true` and the validated data. When validation fails, it returns `success: false` and a more user-friendly format for the errors.

Notice how we transform the error issues into a simpler structure. Instead of passing along the entire Valibot error object, we extract just the field path and error message—the parts your application code actually needs.

Now update your `index.js` to use this validation service:

```javascript
[label index.js]
import { validatePerson } from './validator.js';

// Valid person data
const validPerson = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  age: 25
};

// Invalid person data
const invalidPerson = {
  name: 'Jo',
  email: 'not-an-email',
  age: 16
};

// Validate both examples
const validResult = validatePerson(validPerson);
const invalidResult = validatePerson(invalidPerson);

// Check results
console.log('Valid person result:', validResult.success);
if (validResult.success) {
  console.log('Validated data:', validResult.data);
}

console.log('Invalid person result:', invalidResult.success);
if (!invalidResult.success) {
  console.log('Validation errors:');
  invalidResult.errors.forEach(error => {
    console.log(`- ${error.field}: ${error.message}`);
  });
}
```

With this approach, your main code doesn't need to handle try/catch blocks or directly interact with Valibot's error format. It simply calls the validation function and checks the `success` property to determine what to do next. This pattern works well for validating form data, API requests, and other user inputs.

Save both files and run the main file:

```command
node index.js
```

You should see this output:

```text
[output]

Valid person result: true
Validated data: { name: 'Jane Doe', email: 'jane@example.com', age: 25 }
Invalid person result: false
Validation errors:
- name: Name must be at least 3 characters
- email: Must be a valid email address
- age: Must be at least 18 years old
```

Separating validation logic makes real-world apps easier to manage. You'll often need to validate the same data in forms, APIs, and file imports.
 Centralizing validation ensures consistent rules everywhere and makes updates simpler when requirements change.

## Using Valibot with TypeScript

In this section, you'll use Valibot with TypeScript to generate types directly from your schemas. This lets you validate data at runtime while getting full type safety during development.

![Valibot TypeScript integration diagram showing how schemas automatically generate TypeScript types. The schema definition creates both runtime validation and compile-time type checking, creating a single source of truth for data structures](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/2910e14b-4dba-499e-8c8e-f9cff10a9700/public =2022x780)

Let's convert the project to TypeScript. First, install TypeScript and related tools:

```command
npm install -D typescript tsx @types/node
```

Then initialize a basic TypeScript configuration:

```command
npx tsc --init
```

Now, let's convert the validator to TypeScript. Rename your existing `validator.js` file to `validator.ts` so we can start using TypeScript features:

```typescript
[label validator.ts]
import * as v from 'valibot';

// Define our person schema
const personSchema = v.object({
  name: v.pipe(
    v.string('Name must be a string'),
    v.minLength(3, 'Name must be at least 3 characters'),
    v.maxLength(20, 'Name cannot exceed 20 characters')
  ),
  email: v.pipe(
    v.string('Email must be a string'),
    v.email('Must be a valid email address')
  ),
  age: v.pipe(
    v.number('Age must be a number'),
    v.minValue(18, 'Must be at least 18 years old')
  )
});

[highlight]
// Generate TypeScript type from the schema
type Person = v.InferOutput<typeof personSchema>;

// Define return types for our validation function
type ValidationSuccess<T> = { data: T; success: true };
type ValidationError = { 
  success: false; 
  errors: Array<{ field: string; message: string }> 
};
type ValidationResult<T> = ValidationSuccess<T> | ValidationError;

// Create a function to validate a person
function validatePerson(data: unknown): ValidationResult<Person> {
[/highlight]
  try {
    // Validate against our schema
    const validatedData = v.parse(personSchema, data);
    return { data: validatedData, success: true };
[highlight]
  } catch (error: any) {
    // Return validation errors
    return { 
      success: false, 
      errors: error.issues.map((issue: any) => ({
        field: issue.path.map((p: any) => p.key).join('.'),
        message: issue.message
      }))
    };
  }
[/highlight]
}

export { validatePerson, Person };
```

The key addition here is `type Person = v.InferOutput<typeof personSchema>`, which automatically generates a TypeScript type from our schema. This means we don't have to define a type that matches our schema manually - Valibot does it for us.

Now, let's rename the existing `index.js` file to `index.ts` so it can use the typed validator:

```typescript
[label index.ts]
[highlight]
import { validatePerson, Person } from './validator.js';
[/highlight]

// Valid person data
const validPerson = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  age: 25
};

// Invalid person data
const invalidPerson = {
  name: 'Jo',
  email: 'not-an-email',
  age: 16
};

[highlight]
// Validate both examples
const validResult = validatePerson(validPerson);
const invalidResult = validatePerson(invalidPerson);

// Check the valid result with type safety
if (validResult.success) {
  // TypeScript knows this is a Person type
  const person: Person = validResult.data;
  console.log('Valid person data:', person);
  
  // This would cause a TypeScript error:
  // person.nonExistentProperty = 123;
} else {
  // This code will never run for validPerson,
  // but TypeScript knows the type structure
  console.log('Validation errors:', validResult.errors);
}
[/highlight]

// Check the invalid result
if (!invalidResult.success) {
  console.log('Invalid person result:');
  invalidResult.errors.forEach(error => {
    console.log(`- ${error.field}: ${error.message}`);
  });
}
```

Run the TypeScript file with `tsx`:

```command
npx tsx index.ts
```

You should see output similar to:

```text
[output]
Valid person data: { name: 'Jane Doe', email: 'jane@example.com', age: 25 }
Validation errors:
- name: Name must be at least 3 characters
- email: Must be a valid email address
- age: Must be at least 18 years old
```

What makes this approach powerful is that TypeScript now knows precisely what structure a valid Person has. When you access properties on `validResult.data`, you get complete type checking, autocompletion, and compiler errors if you try to access properties that don't exist.

The type safety extends to your entire codebase. For example, if you pass the validated data to another function, TypeScript will ensure that function uses the data correctly. This helps catch errors at compile time rather than runtime.

## Final thoughts
You’ve now seen how to use Valibot for clean, consistent data validation, from basic JavaScript to full TypeScript integration.

This setup works well for forms, APIs, and more. To explore advanced features like custom validators or async parsing, check out the [official Valibot docs](https://valibot.dev).
