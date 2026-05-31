# Getting Started with Yup

[Yup](https://github.com/jquense/yup) is a JavaScript library that validates data. It lets you build clear, easy-to-read rules using chainable methods. It started as a tool inspired by React PropTypes but has grown into a powerful, standalone solution focused on being easy for developers to use.

While some validation libraries are simple but limited, and others are powerful but hard to use, Yup is both easy and powerful. 

This article will show you how to use Yup in real-world situations. You’ll learn how to build validation schemas, handle errors, work with TypeScript, and even clean up data as you validate it.

[ad-logs]

## Prerequisites

To follow along with this tutorial, you'll need an updated installation of [Node.js](https://nodejs.org/en/download/) and `npm`. Although Yup was initially developed with JavaScript in mind, it has grown to embrace TypeScript fully, offering excellent type inference capabilities.

 While not strictly necessary, some familiarity with [TypeScript fundamentals](https://www.typescriptlang.org/docs/) will help you take full advantage of Yup's type-safety features as we progress through more advanced examples later in this article.


## Setting up the project directory

We’ll begin by setting up a modern JavaScript project using ES modules. This lets you use the latest JavaScript features while staying compatible with most tools and libraries.

First, create a project for your validation project:

```command
mkdir yup-validation && cd yup-validation
```

Initialize a new npm project:

```command
npm init -y
```

Modern JavaScript favors ES modules over CommonJS for better compatibility and future-proofing.

To configure your project to use ES modules, run:

```command
npm pkg set type=module
```

Now install Yup as your main dependency, along with some development tools to simplify your workflow:

```command
npm install yup
```

Then, add TypeScript and TSX as development dependencies:

```command
npm install --save-dev typescript tsx
```

Here’s what each package does:

- [`yup`](https://github.com/jquense/yup): The core validation library with a clean, chainable API.
- [`typescript`](https://www.typescriptlang.org/): Adds static type checking and improves your development experience with better editor support.
- [`tsx`](https://github.com/esbuild-kit/tsx): Lets you run TypeScript files directly without compiling them first.

Now, generate a basic TypeScript configuration file:


```command
npx tsc --init
```

Add the following script commands to your `package.json` to make it easy to run both TypeScript and JavaScript files:


```json
[label package.json]
{
  ...
  "scripts": {
[highlight]
    "dev": "tsx index.ts",
    "dev:js": "node index.js"
[/highlight]
  }
}
```

Here’s what each script does:

- `"dev"` runs your TypeScript entry file using TSX.
- `"dev:js"` runs a plain JavaScript file using Node.js. 

This setup lets you quickly switch between JS and TS during development.

With everything set up, you’re now ready to dive into Yup and build validation logic in JavaScript and TypeScript.

## Getting started with Yup

Yup uses a simple, declarative style for validation. Instead of writing custom logic for every field, you describe what valid data should look like using a schema. Yup takes care of the rest.

To get started, create a new file called `validation.js`:

```javascript
[label validation.js]
import * as yup from 'yup';

const userSchema = yup.object({
  username: yup.string().min(3).max(30).required(),
  email: yup.string().email().required(),
  age: yup.number().integer().min(18).required(),
});

export default userSchema;
```

This schema describes what a valid user object should look like:

- `username`: A required string between 3 and 30 characters  
- `email`: A required, properly formatted email address  
- `age`: A required whole number, 18 or older  

Yup schemas are easy to read—they almost feel like plain English. Each field has a type (like string or number), followed by rules for what's allowed.

Now, create a file called `index.js` that uses this schema to validate some data:

```javascript
[label index.js]
import userSchema from './validation.js';

const userData = {
  username: 'johndoe',
  email: 'john.doe@example.com',
  age: 25
};

async function validateUser() {
  try {
    const validData = await userSchema.validate(userData);
    console.log('Valid user data:', validData);
  } catch (error) {
    console.error('Validation error:', error.message);
  }
}

validateUser();
```
In this code snippet, you import the schema and use it to validate a sample `userData` object. The `validate()` method checks if the data matches your rules. If it does, the valid data is logged; if not, the error message is shown. This approach keeps your validation clean and reusable.


Run this example with:

```command
npm run dev:js
```

You should see confirmation that the data passed validation:

```text
[output]
Valid user data: { username: 'johndoe', email: 'john.doe@example.com', age: 25 }
```

When validation passes, Yup returns the validated data—sometimes with transformations applied. If validation fails, it throws a `ValidationError` with details about what went wrong.

Since Yup uses Promises, it works smoothly with `async/await`, making it a great fit for modern JavaScript workflows.


## Customizing validations in Yup

Basic validations handle most common cases, but real-world apps often need more advanced rules. Yup gives you the tools to build complex validations without making your code messy.

### Adding constraints with custom error messages

Yup’s built-in error messages work, but they’re pretty generic. To give users clearer feedback and match your app’s tone, you can easily customize these messages:


```javascript
[label validation.js]
import * as yup from 'yup';

const userSchema = yup.object({
[highlight]
  username: yup.string()
    .min(3, 'Username must have at least 3 characters')
    .max(30, 'Username cannot exceed 30 characters')
    .matches(/^[a-zA-Z0-9]+$/, 'Username must only contain letters and numbers')
    .required('Username is required'),
  
  email: yup.string()
    .email('Please provide a valid email address')
    .required('Email is required'),
  
  age: yup.number()
    .typeError('Age must be a number')
    .integer('Age must be a whole number')
    .min(18, 'You must be at least 18 years old')
    .required('Age is required'),
[/highlight]
});

export default userSchema;
```

Yup makes it easy to customize error messages—just pass your custom message as the second parameter to each validation method. This keeps error messages close to their respective validation rules, making the code easier to understand.

The `.typeError()` method is useful for handling cases where the input is not the expected type. This is especially important for form inputs, which might come as strings even when you expect numbers. Without this, you’d get a generic error, making it harder for users to understand what went wrong.

For example, the `.matches()` method on the username field ensures the input only allows alphanumeric characters, which is a common requirement for usernames.

Now, let’s test these enhanced validations with some invalid input:

```javascript
[label index.js]
import userSchema from './validation.js';

[highlight]
const invalidUserData = {
  username: 'j#',  // Too short and contains special characters
  email: 'not-an-email',  // Invalid format
  age: 16  // Under 18
};
[/highlight]

async function validateUser() {
  try {
[highlight]
    const validData = await userSchema.validate(invalidUserData);
[/highlight]
    console.log('Valid user data:', validData);
  } catch (error) {
    console.error('Validation error:', error.message);
  }
}

validateUser();
```

By default, Yup stops validating as soon as it hits the first error. So when you run this script with invalid input, it will only show the first error it finds. Here's what you'll see:

```command
npm run dev:js
```

```text
[output]
Validation error: You must be at least 18 years old
```

For most user interfaces, especially forms, you'll want to collect all validation errors simultaneously so users can fix everything in one go. Yup supports this with the `abortEarly` option:

```javascript
[label index.js]
import userSchema from './validation.js';

const invalidUserData = {
  username: 'j#',
  email: 'not-an-email',
  age: 16
};

async function validateUser() {
  try {
[highlight]
    const validData = await userSchema.validate(invalidUserData, { 
      abortEarly: false 
    });
[/highlight]
    console.log('Valid user data:', validData);
  } catch (error) {
    console.error('Validation errors:');
[highlight]
    error.inner.forEach(err => {
      console.error(`- ${err.path}: ${err.message}`);
    });
[/highlight]
  }
}

validateUser();
```

When `abortEarly` is set to `false`, Yup checks all fields and collects every validation error it finds. These are stored in the `inner` array of the error object, making it easy to process all errors at once:

```text
[output]
Validation error: 4 errors occurred
- username: Username must have at least 3 characters
- username: Username must only contain letters and numbers
- email: Please provide a valid email address
- age: You must be at least 18 years old
```

Unlike basic type-checking libraries, Yup can catch multiple issues in a single field—like the `username` having the wrong format and being too short.

 This gives users clear, complete feedback up front, so they can fix everything immediately instead of going through a frustrating loop of submitting, fixing, and resubmitting.

### Conditional validation

One of Yup’s powerful features is its ability to change validation rules based on other values in the data. With the `.when()` method, you can make fields behave differently depending on context.

Here's how you can update your schema to support role-based permissions:

```javascript
[label validation.js]
import * as yup from 'yup';

const userSchema = yup.object({
  ...
  age: yup.number()
    .typeError('Age must be a number')
    .integer('Age must be a whole number')
    .min(18, 'You must be at least 18 years old')
    .required('Age is required'),
[highlight]  
  role: yup.string()
    .oneOf(['user', 'admin', 'moderator'], 'Invalid role selected')
    .default('user'),
  
  permissions: yup.array()
    .of(yup.string())
    .when('role', {
      is: 'admin',
      then: schema => schema
        .min(1, 'At least one permission is required for admin users')
        .required('Permissions are required for admin users'),
      otherwise: schema => schema
        .length(0, 'Permissions are only allowed for admin users')
    })
[/highlight]
});

export default userSchema;
```

This updated schema adds two new fields:

- `role`: Must be `'user'`, `'admin'`, or `'moderator'`, and defaults to `'user'` if not provided.
- `permissions`: Changes behavior based on the role. If the role is `admin`, at least one permission is required. For everyone else, the array must be empty or not included.

The `.when()` method sets up this conditional logic, ensuring your validation reflects real-world business rules. The `oneOf()` method locks down the allowed roles, and `default()` fills in missing values automatically.

Now let’s see how the conditional logic works in practice. Replace everything in `index.js` with the code below to test different user roles and permission setups:


```javascript
[label index.js]
import userSchema from './validation.js';

// Test various user scenarios
async function testValidations() {
  const testCases = [
    {
      label: "Admin without permissions",
      data: {
        username: "admin_user",
        email: "admin@example.com",
        age: 30,
        role: "admin"
        // Missing permissions
      }
    },
    {
      label: "Regular user with permissions",
      data: {
        username: "regular_user",
        email: "user@example.com",
        age: 25,
        role: "user",
        permissions: ["read"] // Not allowed for regular users
      }
    },
    {
      label: "Valid admin",
      data: {
        username: "valid_admin",
        email: "valid.admin@example.com",
        age: 35,
        role: "admin",
        permissions: ["read", "write", "delete"]
      }
    }
  ];

  for (const testCase of testCases) {
    console.log(`\nTesting: ${testCase.label}`);
    try {
      const validData = await userSchema.validate(testCase.data, { abortEarly: false });
      console.log("✓ Valid");
    } catch (error) {
      console.log("✗ Invalid");
      error.inner.forEach(err => {
        console.log(`  - ${err.path}: ${err.message}`);
      });
    }
  }
}

testValidations();
```
This script runs three test cases and validates each using your Yup schema. It shows how the validation rules change depending on the `role` field—admins need permissions, while regular users can’t have them.

Setting `abortEarly: false` ensures Yup reports all validation issues simultaneously, instead of stopping after the first error.

Here’s the output you’ll see when running it:

```text
[output]
Testing: Admin without permissions
✗ Invalid
  - permissions: Permissions are required for admin users

Testing: Regular user with permissions
✗ Invalid
  - permissions: Permissions are only allowed for admin users

Testing: Valid admin
✓ Valid
```

This shows how Yup adapts validation rules based on context—handy for real-world scenarios where business logic isn’t always one-size-fits-all.

And this is just the beginning: Yup’s `.when()` method can handle even more complex conditions, multiple fields, and custom logic.


## Handling errors gracefully in Yup

Good validation isn’t just about catching bad data—it’s about clearly explaining what’s wrong so users can fix it.

Yup gives you detailed error information when validation fails, but it’s up to you to present that info in a helpful way.

### Understanding Yup's error structure

When something doesn’t pass validation, Yup throws an error object that includes everything you need to know: what field failed, why it failed, and all the specific messages tied to each issue. Let’s take a closer look at how that works.

To see this in action, replace everything in your `index.js` file with the following:

```javascript
[label index.js]
import userSchema from './validation.js';

const invalidData = {
  username: 'j#',  // Too short and contains special characters
  email: 'invalid',  // Invalid format
  age: 16  // Under 18
};

async function inspectErrors() {
  try {
    await userSchema.validate(invalidData, { abortEarly: false });
    console.log('Valid data');
  } catch (error) {
    // Log the overall error structure
    console.log('Error object structure:');
    console.log(JSON.stringify({
      name: error.name,
      message: error.message,
      path: error.path,
      errors: error.errors,
      inner: error.inner.map(err => ({
        message: err.message,
        path: err.path,
        type: err.type
      }))
    }, null, 2));
    
    // Log details of the first error
    console.log('\nFirst validation error:');
    const firstError = error.inner[0];
    console.log(`- Path: ${firstError.path}`);
    console.log(`- Type: ${firstError.type}`);
    console.log(`- Message: ${firstError.message}`);
  }
}

inspectErrors();
```
In this code, you deliberately pass invalid data to the schema to trigger multiple validation errors. When the schema fails to validate the input, Yup throws a `ValidationError` object. 

The script then logs the overall structure of that error—including its name, message, path, and a detailed list of all individual errors. It also highlights the first error for easy access.

This script helps you understand how Yup structures its error output, which is especially useful when displaying clear, specific messages in your UI.

To run the code, use:

```command
npm run dev:js
```

The output will give you a detailed look at Yup’s error object, showing exactly how you can extract and handle validation issues in a real-world app:

```text
[output]
Error object structure:
{
  "name": "ValidationError",
  "message": "4 errors occurred",
  "errors": [
    "Username must have at least 3 characters",
    "Username must only contain letters and numbers",
    "Please provide a valid email address",
    "You must be at least 18 years old"
  ],
  "inner": [
    {
      "message": "Username must have at least 3 characters",
      "path": "username",
      "type": "min"
    },
    {
      "message": "Username must only contain letters and numbers",
      "path": "username",
      "type": "matches"
    },
    {
      "message": "Please provide a valid email address",
      "path": "email",
      "type": "email"
    },
    {
      "message": "You must be at least 18 years old",
      "path": "age",
      "type": "min"
    }
  ]
}

First validation error:
- Path: username
- Type: min
- Message: Username must have at least 3 characters
```

Yup’s error object is rich with detail:

- A general error message summarizing the total number of issues  
- A flat `errors` array with all the messages  
- An `inner` array that gives you full context for each error—field name (`path`), the rule that failed (`type`), and the message  

This structure is great for debugging and gives you flexibility in how you display feedback. In a real app, you'd likely extract only the relevant parts—like field-specific messages—to show users a clean, helpful error summary.

### Creating user-friendly error messages

For user interfaces, especially forms, you typically want a simpler structure that maps each field to its error message. 

Let's create a helper function to transform Yup's error object into a more user-friendly format:

```javascript
[label index.js]
import userSchema from './validation.js';
[highlight]
// Helper function to transform Yup errors into field-based format
function formatYupErrors(error) {
  if (!error || !error.inner) return {};
  
  return error.inner.reduce((formattedErrors, err) => {
    if (!formattedErrors[err.path]) {
      formattedErrors[err.path] = err.message;
    }
    return formattedErrors;
  }, {});
}
[/highlight]

const invalidData = {
  username: 'j#',
  email: 'invalid',
  age: 16
};

async function inspectErrors() {
  try {
[highlight]
    const validData = await userSchema.validate(invalidData, { abortEarly: false });
    console.log('Valid data:', validData);
[/highlight]
  } catch (error) {
[highlight]
    const formattedErrors = formatYupErrors(error);
    console.log('Validation errors by field:');
    console.log(formattedErrors);
[/highlight]
  }
}

inspectErrors();
```

The `formatYupErrors` function takes Yup's detailed error structure and converts it to a simpler object where each field name maps to its first error message. This format works perfectly for most form libraries and UI components that expect a field-to-error mapping.

Running this script produces:

```text
[output]
Validation errors by field:
{
  username: 'Username must have at least 3 characters',
  email: 'Please provide a valid email address',
  age: 'You must be at least 18 years old'
}
```

This approach shows only the first error per field, which is usually the most relevant for users. Yup's path uses dot notation (like `address.city`) for nested objects, which your helper function preserves. This aligns perfectly with how most form libraries reference nested fields.

While promise-based validation fits most modern JavaScript patterns, Yup also offers a synchronous validation option through `validateSync`:

```javascript
try {
  const validData = userSchema.validateSync(data, { abortEarly: false });
  // Validation succeeded
} catch (error) {
  const formattedErrors = formatYupErrors(error);
  // Handle validation errors
}
```

The synchronous API behaves identically to the async version but returns values directly instead of promises. This can be useful in specific contexts where working with promises would add unnecessary complexity.

## TypeScript integration with Yup

One of the best things about Yup is how well it works with TypeScript. Instead of writing separate validation rules and type definitions, you can define your schema once—and then let Yup generate the types for you using its built-in `InferType` utility.

Let’s see it in action. Start by renaming your `validation.js` file to `validation.ts`, and update it like this:

```typescript
[label validation.ts]
import * as yup from 'yup';

const userSchema = yup.object({
  username: yup.string()
    .min(3, 'Username must have at least 3 characters')
    .max(30, 'Username cannot exceed 30 characters')
    .matches(/^[a-zA-Z0-9]+$/, 'Username must only contain letters and numbers')
    .required('Username is required'),
  
  email: yup.string()
    .email('Please provide a valid email address')
    .required('Email is required'),
  
  age: yup.number()
    .typeError('Age must be a number')
    .integer('Age must be a whole number')
    .min(18, 'You must be at least 18 years old')
    .required('Age is required'),
  
  role: yup.string()
    .oneOf(['user', 'admin', 'moderator'], 'Invalid role selected')
    .default('user'),
  
  permissions: yup.array()
    .of(yup.string())
    .when('role', {
      is: 'admin',
      then: schema => schema
        .min(1, 'At least one permission is required for admin users')
        .required('Permissions are required for admin users'),
      otherwise: schema => schema
        .length(0, 'Permissions are only allowed for admin users')
    })
});

[highlight]
// Infer TypeScript type from the schema
type User = yup.InferType<typeof userSchema>;

export { userSchema, type User };
[/highlight]
```

The key addition here is `type User = yup.InferType<typeof userSchema>` automatically generates a TypeScript type definition that matches your schema. This type will include all the constraints from your schema:

- `username` will be a required string
- `email` will be a required string
- `age` will be a required number
- `role` will be an optional string (with default 'user')
- `permissions` will be an optional array of strings

Now you can use this inferred type in your application code. 

Rename your `index.js` file to `index.ts` and update it:

```typescript
[label index.ts]
[highlight]
import { userSchema, type User } from './validation';

// TypeScript knows the shape of a valid user from the schema
const userData: User = {
  username: 'johndoe',
  email: 'john.doe@example.com',
  age: 25,
  role: 'admin',
  permissions: ['read', 'write']
};
[/highlight]

async function inspectErrors() {
  try {
[highlight]
    // TypeScript knows the validated data will be a valid User
    const validUser: User = await userSchema.validate(userData);
    console.log('Valid user data:', validUser);
[/highlight]
  } catch (error) {
[highlight]
    if (error instanceof Error) {
      console.error('Validation error:', error.message);
    }
[/highlight]
  }
}

inspectErrors();
```

In this updated `index.ts` file, you import both the validation schema and the `User` type, which is automatically inferred from the schema. 

By typing `userData` as `User`, TypeScript can catch any issues—like missing fields or incorrect types—before the code even runs. When you call `userSchema.validate(userData)`, TypeScript knows that the returned value will match the `User` type, so you get full type safety after validation. 


Finally, the `error instanceof Error` check ensures you handle validation errors properly. Altogether, this setup gives you the best of both worlds: runtime validation with Yup, and static type checking with TypeScript, all based on a single source of truth.

Run your TypeScript example:

```command
npm run dev
```

You should see:

```text
[output]
Valid user data: {
  username: 'johndoe',
  email: 'john.doe@example.com',
  age: 25,
  role: 'admin',
  permissions: [ 'read', 'write' ]
}
```

This smooth integration between Yup and TypeScript gives you a strong, reliable validation setup. TypeScript checks your data shapes while you code, and Yup ensures the data is valid at runtime.

Since types are automatically inferred from the schema, you don’t have to define them twice—avoiding duplication and keeping everything consistent as your app evolves.


## Best Practices for using Yup effectively

After learning the fundamentals, here are some advanced patterns and best practices to help you get the most from Yup in real-world applications.

### Reuse schemas with transformations

Yup provides several methods for extending and combining schemas. The `.shape()` method is particularly useful for building upon existing schemas:

```typescript
// Base user schema with common fields
const baseUserSchema = yup.object({
  email: yup.string().email().required(),
  name: yup.string().required(),
  createdAt: yup.date().default(() => new Date())
});

// Extended schema for user registration
const registrationSchema = baseUserSchema.shape({
  password: yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .required(),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required()
});
```

This pattern promotes schema reuse and composition. The `.shape()` method creates a new schema that includes all fields from the base schema plus any additional fields you specify. The new definition overrides the base definition for fields that exist in both.

Yup also offers `.concat()` for merging schemas and `.pick()`/`.omit()` for creating subsets of existing schemas. These methods provide a flexible system for building complex validation rules from reusable components.

### Use transformations to normalize data

Unlike pure validation libraries, Yup can also transform data during the validation process. The `.transform()` method lets you modify values before they're validated or returned:

```typescript
const userInputSchema = yup.object({
  email: yup.string()
    .email()
    .transform(value => value.toLowerCase())
    .required(),
  
  name: yup.string()
    .transform(value => value.trim())
    .required(),
  
  phoneNumber: yup.string()
    .transform(value => value.replace(/\D/g, '')) // Remove non-digits
    .matches(/^\d{10}$/, 'Phone number must be 10 digits')
});
```

These transforms ensure data consistency regardless of how it was entered. The email will always be lowercase, the name won't have leading or trailing spaces, and the phone number will be stripped of any non-digit characters.

Transformations happen during validation, so the returned data will include these normalizations. This helps maintain consistent data formatting throughout your application.

### Create custom validation methods

For validation patterns that you use frequently across your application, consider extending Yup with custom methods:

```typescript
// Add a custom method for password validation
yup.addMethod(yup.string, 'password', function (message = 'Password is not strong enough') {
  return this.min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain an uppercase letter')
    .matches(/[a-z]/, 'Password must contain a lowercase letter')
    .matches(/[0-9]/, 'Password must contain a number')
    .matches(/[^A-Za-z0-9]/, 'Password must contain a special character');
});

// Now you can use it in your schemas
const userSchema = yup.object({
  username: yup.string().required(),
  password: yup.string().password().required()
});
```

The `addMethod()` function extends Yup's capabilities by adding new methods to specific schema types. This approach encapsulates complex validation logic behind simple, reusable methods. Custom methods are particularly valuable for domain-specific validation rules that appear throughout your application.

### Optimize performance with schema reuse

For applications that perform frequent validations, reusing schema instances can improve performance:

```typescript
// Create schemas once at the module level
const loginSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required()
}).strict();

const userProfileSchema = yup.object({
  name: yup.string().required(),
  bio: yup.string().max(500)
}).strict();

// Reuse them for multiple validations
export function validateLogin(data) {
  return loginSchema.validate(data);
}

export function validateProfile(data) {
  return userProfileSchema.validate(data);
}
```

Defining your schema once and reusing it throughout your codebase keeps your validation logic consistent and avoids repetitive setup. Using `.strict()` adds an extra layer of safety by rejecting any unknown fields, helping you catch typos or unintended data before they cause issues.

## Final Thoughts

This guide shows how [Yup](https://github.com/jquense/yup) handles data validation—from simple rules to advanced, dynamic schemas. Its promise-based design fits well with modern JavaScript, and its clean, chainable API makes even complex validation easy to write and understand.

With built-in TypeScript support through `InferType`, Yup helps you avoid duplicating types and validation logic, giving you a single source of truth for your data. While it's often used in forms (especially with React and Formik), it’s just as helpful in validating API responses, configs, and more.

If you're exploring alternatives, [Zod](https://betterstack.com/community/guides/scaling-nodejs/zod-explained/) is a solid option with a more TypeScript-first design and a similarly intuitive API.

Using Yup helps you catch bad data early, provide clear user feedback, and build more robust, maintainable applications.
