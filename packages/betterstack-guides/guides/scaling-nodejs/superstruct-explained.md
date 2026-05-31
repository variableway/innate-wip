# Getting Started with Superstruct

[Superstruct](https://docs.superstructjs.org/) is a simple data validation library that checks your data while your app runs. When you get data from APIs, user forms, or anywhere else, you can't always trust it. Superstruct helps you make sure the data looks exactly like you expect.

You can think of Superstruct as a guard for your application. It stops bad data before it breaks your code. The library works great with TypeScript and gives you clear error messages when something goes wrong.

This guide shows you how to use Superstruct in your TypeScript projects. You'll learn how to create validation rules, check different types of data, handle errors, and use Superstruct in real applications.

Let's get started!

[ad-logs]

## Prerequisites

You need [Node.js](https://nodejs.org/en/download/) and `npm` installed on your computer before you start. You should also know the basics of [TypeScript](https://www.typescriptlang.org/docs/) since this guide assumes you understand TypeScript syntax.

## Setting up the development environment

First, you'll set up a TypeScript project that can run your code directly without building it first. This makes development faster and easier.

Create a new folder for your project:

```command
mkdir superstruct-demo && cd superstruct-demo
```

Start a new npm project:

```command
npm init -y
```

Tell npm to use ES modules:

```command 
npm pkg set type=module
```

Install Superstruct and the TypeScript tools you need:

```command
npm install superstruct
```
```command
npm install --save-dev typescript tsx
```

Here's what each tool does:

- `typescript`: The main TypeScript compiler
- `tsx`: Runs TypeScript files directly without compiling them first

Create your TypeScript config file:

```command
npx tsc --init
```

Update your `tsconfig.json` to use ES2022 or higher to avoid compatibility issues:

```json
[label tsconfig.json]
{
  "compilerOptions": {
[highlight]
    "target": "ES2022",
[/highlight]
...
}
```

The ES2022 target ensures compatibility with modern JavaScript features while avoiding issues with async/await and other features that Superstruct relies on.

Add a script to your `package.json` to run your project easily:

```json
[label package.json]
{
  ...
  "scripts": {
[highlight]
    "dev": "tsx index.ts"
[/highlight]
  }
}
```

Your TypeScript setup is ready. You can write Superstruct code and test it right away.

## Understanding Superstruct fundamentals

Superstruct uses functions to define what your data should look like. You combine these functions to create validation rules that check your data automatically.

Create a file called `schemas.ts` with your first validation schema:

```typescript
[label schemas.ts]
import { object, string, number } from 'superstruct';

const PersonSchema = object({
  firstName: string(),
  lastName: string(),
  age: number(),
});

export default PersonSchema;
```

This schema tells Superstruct that a person object must have:

- `firstName` as a string
- `lastName` as a string  
- `age` as a number

Each validation rule is a function. You can mix and match these functions to create complex validation logic.

Now create your main `index.ts` file to test the validation:

```typescript
[label index.ts]
import PersonSchema from './schemas';
import { StructError } from "superstruct";


const personData = {
  firstName: 'Sarah',
  lastName: 'Johnson', 
  age: 28,
};

try {
  const validatedPerson = PersonSchema.create(personData);
  console.log('Person data is valid:', validatedPerson);
} catch (error) {
  if (error instanceof StructError) {
    console.error("Validation error:", error.message);
  } else {
    console.error("Unexpected error:", error);
  }
}
```

The `create()` method checks your data against the schema. If the data is valid, it returns the data. If not, it throws an error with details about what went wrong.

Run your code:

```command
npm run dev
```

You'll see this output with valid data:

```text
[output]
Person data is valid: { firstName: 'Sarah', lastName: 'Johnson', age: 28 }
```

This shows the basic Superstruct workflow: define schemas with functions, then validate data with the schema's methods.

## Building advanced validation schemas

Superstruct gives you many ways to validate data beyond just checking types. You can add length requirements, format checks, and custom rules that fit your specific needs.

### Adding string constraints

Most string fields need more than just type checking. Superstruct has built-in validators for common string requirements.

Update your `schemas.ts` file to include more detailed validations:

```typescript
[label schemas.ts]
import { object, string, number, size, pattern } from 'superstruct';

const UserSchema = object({
  username: size(string(), 3, 20),
  email: pattern(string(), /^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  password: size(string(), 8, 50),
  phoneNumber: pattern(string(), /^\+?[\d\s-()]+$/),
  age: number(),
});

export default UserSchema;
```

Each validator adds a specific rule:

- `size(string(), 3, 20)`: Username must be 3-20 characters long
- `pattern(string(), /^[^\s@]+@[^\s@]+\.[^\s@]+$/)`: Email must match a valid email pattern
- `size(string(), 8, 50)`: Password must be 8-50 characters long
- `pattern(string(), regex)`: Phone number must match the pattern

Test these rules with invalid data. Update your `index.ts` file:

```typescript
[label index.ts]
import { StructError } from 'superstruct';
[highlight]
import UserSchema from './schemas';
[/highlight]


[highlight]
const invalidUserData = {
  username: 'Jo', // Too short
  email: 'not-an-email', // Wrong format
  password: '123', // Too short
  phoneNumber: 'abc123', // Wrong format
  age: 25,
};
[/highlight]

try {
[highlight]

  const validatedUser = UserSchema.create(invalidUserData);
  console.log('Valid user:', validatedUser);
[/highlight]
} catch (error) {
  if (error instanceof StructError) {
    console.error('Validation error:', error.message);
  } else {
    console.error('Unexpected error:', error);
  }
}
```
In the highlighted code, you're importing the validation schema, creating an object with intentionally invalid data, and attempting to validate it using `UserSchema.create()`. If the validation fails, the code catches the error and logs a helpful message to the console, making it easy to see which fields didn't pass the validation rules.

Run this code:

```command
npm run dev
```

You'll get a clear error message:

```text
[output]
Validation error: At path: username -- Expected a string with a length between `3` and `20` but received one with a length of `2`
```

Superstruct tells you exactly which field failed and why, making it easy to fix problems.

### Creating custom validation functions

You can write your own validation functions for special requirements that the built-in validators don't cover.

Add a custom password validator to your `schemas.ts`:

```typescript
[label schemas.ts]
[highlight]
import { object, string, number, size, pattern, define } from 'superstruct';

const StrongPassword = define('StrongPassword', (value) => {
  if (typeof value !== 'string') return 'Must be a string';
  if (value.length < 8) return 'Must be at least 8 characters';
  if (!/[A-Z]/.test(value)) return 'Must have an uppercase letter';
  if (!/[a-z]/.test(value)) return 'Must have a lowercase letter';
  if (!/\d/.test(value)) return 'Must have a number';
  if (!/[!@#$%^&*]/.test(value)) return 'Must have a special character';
  return true;
});
[/highlight]

const UserSchema = object({
  username: size(string(), 3, 20),
  email: pattern(string(), /^[^\s@]+@[^\s@]+\.[^\s@]+$/),
[highlight]
  password: StrongPassword,
[/highlight]
  phoneNumber: pattern(string(), /^\+?[\d\s-()]+$/),
  age: number(),
});

export default UserSchema;
```

The `define` function creates custom validators. Return `true` if the data is valid, or return an error message string if it's not. This gives you complete control over your validation logic.

Test the strong password requirement by updating your test data:

```typescript
[label index.ts]
import { StructError } from 'superstruct';
import UserSchema from './schemas';

[highlight]
const invalidUserData = {
  username: 'Alice',
  email: 'alice@example.com',
  phoneNumber: '+1-555-0123',
  password: 'password', // Missing uppercase, number, and special character
  age: 25,
};
[/highlight]

try {
  const validatedUser = UserSchema.create(invalidUserData);
  console.log('Valid user:', validatedUser);
} catch (error) {
  if (error instanceof StructError) {
    console.error('Validation error:', error.message);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

When you run the program, the validation will fail with:

```text
[output]
Validation error: At path: password -- Must have an uppercase letter
```

### Combining multiple validation rules

You can also chain multiple validations together by creating more complex schemas. This allows you to build sophisticated validation logic step by step.

Update your `schemas.ts` to include nested validation:

```typescript
[label schemas.ts]
[highlight]
import { object, string, number, size, pattern, define, optional, array } from 'superstruct';
[/highlight]

const StrongPassword = define('StrongPassword', (value) => {
  if (typeof value !== 'string') return 'Must be a string';
  if (value.length < 8) return 'Must be at least 8 characters';
  if (!/[A-Z]/.test(value)) return 'Must have an uppercase letter';
  if (!/[a-z]/.test(value)) return 'Must have a lowercase letter';
  if (!/\d/.test(value)) return 'Must have a number';
  if (!/[!@#$%^&*]/.test(value)) return 'Must have a special character';
  return true;
});

[highlight]
const AddressSchema = object({
  street: string(),
  city: string(),
  zipCode: pattern(string(), /^\d{5}(-\d{4})?$/),
  country: string(),
});

const UserSchema = object({
  username: size(string(), 3, 20),
  email: pattern(string(), /^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  password: StrongPassword,
  phoneNumber: optional(pattern(string(), /^\+?[\d\s-()]+$/)),
  age: number(),
  address: AddressSchema,
  hobbies: array(string()),
});
[/highlight]

export default UserSchema;
```

This nested structure shows how Superstruct handles complex objects:

- `AddressSchema` validates address components separately
- `optional()` makes phone number not required
- `array(string())` ensures hobbies is a list of strings
- `zipCode` uses a regex pattern for US zip codes

Test the nested validation with complete data:

```typescript
[label index.ts]
import { StructError } from 'superstruct';
import UserSchema from './schemas';

[highlight]
const completeUserData = {
  username: 'Alice123',
  email: 'alice@example.com',
  password: 'SecurePass123!',
  phoneNumber: '+1-555-0123',
  age: 28,
  address: {
    street: '123 Main St',
    city: 'Springfield', 
    zipCode: '12345',
    country: 'USA'
  },
  hobbies: ['reading', 'hiking', 'cooking']
};
[/highlight]

try {
[highlight]
  const validatedUser = UserSchema.create(completeUserData);
[/highlight]
  console.log('Valid user created:', validatedUser.username);
} catch (error) {
  if (error instanceof StructError) {
    console.error('Validation error:', error.message);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

Now when you run the code with valid data:

```command
npm run dev
```

You'll see successful validation:

```text
[output]
Valid user: {
  username: 'Alice123',
  email: 'alice@example.com',
  password: 'SecurePass123!',
  phoneNumber: '+1-555-0123',
  age: 28,
  address: {
    street: '123 Main St',
    city: 'Springfield',
    zipCode: '12345',
    country: 'USA'
  },
  hobbies: [ 'reading', 'hiking', 'cooking' ]
}
```

And in the console, it might look something like this:

![Screenshot of the output](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/a9ac4b0b-6ee2-4b7d-fab5-64d42dd4b100/public =1404x1170)

The output is well-formatted, and certain elements, such as strings, numbers, and keys, are color—coded, making it easier to read and identify details quickly.


This demonstrates how you can build complex validation schemas by combining simple validation functions. Each piece handles one concern, making your validation logic easy to understand and maintain.


## Handling validation errors gracefully

Superstruct gives you detailed information about validation failures. You can use this information to debug problems and show helpful messages to users.

### Understanding Superstruct error structure

When validation fails, Superstruct creates error objects that tell you exactly what went wrong and where the problem occurred.

Create a new file to explore error handling:

```typescript
[label error-handling.ts]
import { StructError } from 'superstruct';
import UserSchema from './schemas';

const problematicData = {
  username: 'x', // Too short
  email: 'bad-email', // Wrong format
  password: 'weak', // Doesn't meet strength requirements
  age: -5, // Negative number
  address: {
    street: '123 Main St',
    city: 'Springfield',
    zipCode: '1234', // Wrong format
    country: 'USA'
  },
  hobbies: ['reading', 123] // Mixed types in array
};

try {
  UserSchema.create(problematicData);
} catch (error) {
  if (error instanceof StructError) {
    console.log('Error type:', error.type);
    console.log('Field path:', error.path);
    console.log('Bad value:', error.value);
    console.log('Error message:', error.message);
  }
}
```

In this code, you're creating data with multiple validation problems, then examining the error object's properties to understand what information Superstruct provides when validation fails.

Run this code:

```command
npx tsx error-handling.ts
```

You'll see detailed error information:

```text
[output]
Error type: string
Field path: [ 'username' ]
Bad value: x
Error message: At path: username -- Expected a string with a length between `3` and `20` but received one with a length of `1`
```

`StructError` objects give you structured information about validation failures. You can see which field failed, what value caused the problem, and get a human-readable description.

### Collecting multiple validation errors

By default, Superstruct stops at the first error it finds. You can collect all errors at once using the `validate` method instead of `create`.

Update your error handling file:

```typescript
[label error-handling.ts]
[highlight]
import { StructError, validate } from 'superstruct';
[/highlight]
import UserSchema from './schemas';

const problematicData = {
  ...
};

[highlight]
const [error, result] = validate(problematicData, UserSchema);

if (error) {
  console.log('All validation problems:');
  
  const failures = error.failures();
  failures.forEach(failure => {
    console.log(`${failure.path.join('.')}: ${failure.message}`);
  });
} else {
  console.log('Validation passed:', result);
}
[/highlight]
```

The `validate` method returns a tuple with either an error or the validated result. The `failures()` method gives you every validation error in your data, so you can show users all the problems at once instead of making them fix one error at a time.

Run the updated code:

```command
npx tsx error-handling.ts
```

You'll see all validation errors listed:

```text
[output]
All validation problems:
username: Expected a string with a length between `3` and `20` but received one with a length of `1`
email: Expected a string matching `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` but received "bad-email"
password: Must be at least 8 characters
address.zipCode: Expected a string matching `/^\d{5}(-\d{4})?$/` but received "1234"
hobbies.1: Expected a string, but received: 123
```

### Creating user-friendly error messages

Raw Superstruct errors can be too technical for regular users. You can create helper functions to make the messages more friendly and actionable.

Add a formatting function to your error handling file:

```typescript
[label error-handling.ts]
import { StructError, validate } from 'superstruct';
import UserSchema from './schemas';

[highlight]
function formatValidationErrors(error: StructError): Record<string, string> {
  const errorMap: Record<string, string> = {};
  
  error.failures().forEach(failure => {
    const fieldPath = failure.path.join('.');
    const fieldName = fieldPath || 'root';
    
    // Transform technical messages into user-friendly ones
    let message = failure.message;
    if (message.includes('Expected a string') && message.includes('length')) {
      message = 'This field must be between the required length';
    } else if (message.includes('matching') && fieldName === 'email') {
      message = 'Please enter a valid email address';
    } else if (message.includes('matching') && fieldName === 'address.zipCode') {
      message = 'Please enter a valid ZIP code (e.g., 12345 or 12345-6789)';
    } else if (message.includes('Expected a number')) {
      message = 'This field must be a number';
    } else if (message.includes('Expected a string') && fieldName.includes('hobbies')) {
      message = 'All hobbies must be text';
    }
    
    errorMap[fieldName] = message;
  });
  
  return errorMap;
}
[/highlight]

const problematicData = {
  username: 'x',
  email: 'bad-email',
  password: 'weak',
  age: 'not-a-number',
  address: {
    street: '123 Main St',
    city: 'Springfield',
    zipCode: '1234',
    country: 'USA'
  },
  hobbies: ['reading', 123]
};

const [error, result] = validate(problematicData, UserSchema);

if (error) {
[highlight]
  const friendlyErrors = formatValidationErrors(error);
  console.log('User-friendly errors:');
  Object.entries(friendlyErrors).forEach(([field, message]) => {
    console.log(`${field}: ${message}`);
  });
[/highlight]
} else {
  console.log('Validation passed:', result);
}
```

This formatting function converts technical error messages into language that regular users can understand. You keep the structured format you need for forms and APIs, but make the messages much clearer.

Run the code with friendly error formatting:

```command
npx tsx error-handling.ts
```

You'll see much more user-friendly error messages:

```text
[output]
User-friendly errors:
username: This field must be between the required length
email: Please enter a valid email address
password: Must be at least 8 characters
address.zipCode: Please enter a valid ZIP code (e.g., 12345 or 12345-6789)
hobbies.1: All hobbies must be text
```

![Screenshot of user-friendly error messages](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/22021547-e64f-441d-fe03-f1c3d4a99c00/lg2x =1404x1170)

This approach transforms technical validation messages into language that regular users can understand, while maintaining the structured format needed for form validation or API responses.

## Final thoughts

This guide showed you how to use Superstruct for data validation in TypeScript projects. You learned to create schemas, add custom rules, handle errors, and make error messages user-friendly.

Superstruct's functional approach makes it easy to build complex validation from simple parts, while TypeScript integration keeps your code type-safe automatically.

You're now ready to add solid data validation to your applications. For advanced features and complete API details, check the official [Superstruct documentation](https://docs.superstructjs.org/).

Start with basic schemas and build up to more complex validation as your app grows. Good validation is one of the best ways to make your application reliable and user-friendly.