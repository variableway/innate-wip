# Beginner's Guide to TypeBox

[TypeBox](https://github.com/sinclairzx81/typebox) is a fast and type-safe way to validate data in TypeScript. It lets you define your data structure once and uses that same definition for both type checking and runtime validation. This means you don’t have to write separate types and validation rules—TypeBox handles both.

It’s built specifically for TypeScript and works great when you want strict, reliable data validation without slowing things down. The API is clean, easy to use, and solid performance—even for large data sets.

In this guide, you’ll use TypeBox in a TypeScript project. You’ll define schemas, validate data, handle errors, and use more advanced patterns when needed.

[ad-logs]
## Prerequisites

Before you begin, make sure you have:

- [Node.js](https://nodejs.org/) (version 22 or newer) installed  
- A basic understanding of TypeScript  



## Setting up the project

In this section, you’ll set up a basic TypeScript environment so you can start using TypeBox right away.

First, create a new project directory and initialize it as an npm project:


```command
mkdir typebox-demo && cd typebox-demo
```

```command
npm init -y
```

Install TypeScript as a dev dependency and TypeBox as a regular dependency:

```command
npm install --save-dev typescript
```
```command
npm install @sinclair/typebox
```

Create a basic TypeScript configuration:

```command
npx tsc --init
```

Now, update your `package.json` to make it easy to run TypeScript files:

```json
[label package.json]
{
  "scripts": {
[highlight]
    "dev": "tsx index.ts"
[/highlight]
  }
}
```

Install tsx for running TypeScript files directly:

```command
npm install --save-dev tsx
```
You're now ready to write and run TypeScript code using TypeBox.


## Getting started with TypeBox
Now that your project is set up, let’s create your first TypeBox schema. 

Create an `index.ts` file in your project root with the following content:

```typescript
[label index.ts]
import { Type } from '@sinclair/typebox';
import { TypeCompiler } from '@sinclair/typebox/compiler';

// Define a schema for a User
const UserSchema = Type.Object({
  name: Type.String(),
  age: Type.Number(),
  email: Type.String()
});

// Sample user data
const userData = {
  name: 'John Doe',
  age: 30,
  email: 'john@example.com'
};

// Compile the schema for validation
const validator = TypeCompiler.Compile(UserSchema);

// Validate the data
const result = validator.Check(userData);

console.log('Is valid?', result);
```
In this code, you define a simple `UserSchema` using TypeBox, which describes what a valid user object should look like—containing a string `name`, a number `age`, and a string `email`. Then, you create a sample `userData` object that matches the schema. 

Using `TypeCompiler.Compile`, you turn the schema into a fast, reusable validation function. The `Check` method runs the actual validation, returning `true` if the data matches the schema or `false` if it doesn’t.

To try it out, run the script with:


```command
npm run dev
```

```text
[output]
Is valid? true
```

You've just created your first TypeBox schema! This example defines a simple `UserSchema` with three properties and checks if a `userData` object matches it. TypeBox uses a compiler-based approach to generate fast validation functions, which makes it great for performance.

### Basic schema validation

Now, let's enhance our validation by adding more constraints to our schema:

```typescript
import { Type } from '@sinclair/typebox';
import { TypeCompiler } from '@sinclair/typebox/compiler';

// Define a schema with constraints
const UserSchema = Type.Object({
[highlight]
  name: Type.String({ minLength: 2, maxLength: 50 }),
  age: Type.Number({ minimum: 18, maximum: 120 }),
  email: Type.String({ format: 'email' })
[/highlight]
});

// Valid user data
const userData = {
  name: 'John Doe',
  age: 30,
  email: 'john@example.com'
};

[highlight]
// Invalid user data
const invalidUser = {
  name: 'J', // Too short
  age: 16,   // Below minimum
  email: 'not-an-email' // Invalid format
};

// Compile the schema
const validator = TypeCompiler.Compile(UserSchema);

// Validate both users
console.log('Valid user:', validator.Check(userData));
console.log('Invalid user:', validator.Check(invalidUser));

// Get validation errors
if (!validator.Check(invalidUser)) {
  console.log('Validation errors:', [...validator.Errors(invalidUser)]);
}
[/highlight]
```

In the highlighted code, you add constraints to the schema:

- `name` must be between 2 and 50 characters  
- `age` must be between 18 and 120  
- `email` must follow a valid email format  

You then create an `invalidUser` object that purposely breaks all three rules. The code checks if this object is valid using `validator.Check()`, and if it’s not, it prints detailed validation errors using `validator.Errors()`.

Run the code again:

```command
npm run dev
```
You’ll see:

```text
[output]
Valid user: false
Invalid user: false
Validation errors: [
  {
    type: 52,
    schema: {
      minLength: 2,
      maxLength: 50,
      type: 'string',
      [Symbol(TypeBox.Kind)]: 'String'
    },
    path: '/name',
    value: 'J',
    message: 'Expected string length greater or equal to 2',
    errors: []
  },
  {
    type: 39,
    schema: {
      minimum: 18,
      maximum: 120,
      type: 'number',
      [Symbol(TypeBox.Kind)]: 'Number'
    },
    path: '/age',
    value: 16,
    message: 'Expected number to be greater or equal to 18',
    errors: []
  },
  {
    type: 49,
    schema: {
      format: 'email',
      type: 'string',
      [Symbol(TypeBox.Kind)]: 'String'
    },
    path: '/email',
    value: 'not-an-email',
    message: "Unknown format 'email'",
    errors: []
  }
]
```

Note that the `Errors` method returns an iterator that needs to be converted to an array (using the spread operator `[...]`) to display the full error details. Each error object includes the failing validation rule's location, the invalid property's path, and a human-readable error message.


## Type inference with TypeBox

One of TypeBox’s biggest strengths is its ability to generate TypeScript types directly from your schemas. This keeps your validation and type definitions in sync without any extra work. You define your schema once, and TypeBox gives you both runtime validation and compile-time type safety.

Let’s see how it works in practice.


Create a new file called `type-inference.ts`:

```typescript
[label type-inference.ts]
import { Type } from '@sinclair/typebox';
import { TypeCompiler } from '@sinclair/typebox/compiler';

// Define a schema
const UserSchema = Type.Object({
  name: Type.String(),
  age: Type.Number(),
  email: Type.String(),
  isActive: Type.Boolean()
});

// Extract TypeScript type from schema
type User = typeof UserSchema.static;

// Create a user with the correct types
const user: User = {
  name: 'Jane Doe',
  age: 30,
  email: 'jane@example.com',
  isActive: true
};

console.log('User created successfully:', user);
```
In this code, you define a `UserSchema` using TypeBox, then use `typeof UserSchema.static` to automatically generate a matching TypeScript type called `User`.

This means you don’t need to write a separate type definition manually—TypeBox handles it for you. You then create a `user` object that matches the schema, and TypeScript will catch any mistakes if the structure doesn’t match. This keeps your validation and types ideally in sync.

Run this new file:

```command
npx tsx type-inference.ts
```

```text
[output]
User created successfully: {
  name: 'Jane Doe',
  age: 30,
  email: 'jane@example.com',
  isActive: true
}
```

The key part is `type User = typeof UserSchema.static`, which extracts a TypeScript type from your schema. TypeScript now knows precisely what properties and types a `User` should have.

Try experimenting with invalid types. Add this to the end of your file:

```typescript
[label type-inference.ts]
...
// This will cause TypeScript compilation errors
const badUser: User = {
  name: 'John',
  age: '25', // Error: string is not assignable to number
  email: 'john@example.com',
  isActive: 'yes' // Error: string is not assignable to boolean
};
```

Your editor will immediately show errors for the incorrect types. TypeScript knows that `age` must be a number and `isActive` must be a boolean.


## Optional and nullable properties

Real-world data often includes properties that might be missing or have null values. TypeBox makes it easy to define and validate these types of fields in your schemas, extending what you've already learned about basic property validation.

Create a new file called `optional-nullable.ts`:

```typescript
[label optional-nullable.ts]
[label optional-nullable.ts]
import { Type } from '@sinclair/typebox';
import { TypeCompiler } from '@sinclair/typebox/compiler';

// Define a schema with optional and nullable properties
const ProfileSchema = Type.Object({
  username: Type.String(),
  displayName: Type.Optional(Type.String()),
  bio: Type.Union([Type.String(), Type.Null()]), // nullable string
  website: Type.Union([Type.String(), Type.Null()]), // another nullable string
  age: Type.Optional(Type.Number())
});

// Extract the TypeScript type - just like you learned earlier
type Profile = typeof ProfileSchema.static;

// Create a valid profile using optional/nullable fields
const profile: Profile = {
  username: 'johndoe',
  // displayName is optional, so we can omit it
  bio: null, // bio can be null
  website: 'https://example.com'
  // age is optional, so we can omit it
};

// Compile and validate - the same pattern we've been using
const validator = TypeCompiler.Compile(ProfileSchema);
console.log('Valid profile:', validator.Check(profile));

// Invalid profile - missing required field
const invalidProfile = {
  // username is missing
  displayName: 'John',
  bio: null,
  website: 'https://example.com'
};

console.log('Invalid profile:', validator.Check(invalidProfile));
console.log('Validation errors:', [...validator.Errors(invalidProfile)]);
```

In this example, you define a schema with several types of fields:

- `username`: A required string field (just like in previous examples)
-  `displayName`: An optional string field (may be omitted)
- `bio`: A nullable string field (must be present but can be null)
- `website`: A field that can be either a string or null
- `age`: An optional number field (may be omitted)

The key difference in this example is how we handle nullable fields. Rather than using a dedicated `Nullable` function (which may not be available in all TypeBox versions), we use `Type.Union([Type.String(), Type.Null()])` to create a field that accepts either a string or null value.

Run the example:

```command
npx tsx optional-nullable.ts
```

```text
[output]
Valid profile: true
Invalid profile: false
Validation errors: [
  {
    type: 45,
    schema: { type: 'string', [Symbol(TypeBox.Kind)]: 'String' },
    path: '/username',
    value: undefined,
    message: 'Expected required property',
    errors: []
  },
  {
    type: 54,
    schema: { type: 'string', [Symbol(TypeBox.Kind)]: 'String' },
    path: '/username',
    value: undefined,
    message: 'Expected string',
    errors: []
  }
]
```

As you can see, TypeBox validates that required fields must be present, while allowing optional fields to be omitted.


## Nested objects and arrays

Most real applications need to validate complex data with nested objects and arrays. TypeBox makes this easy by letting you compose schemas.

Create a new file called `nested-schemas.ts`:

```typescript
[label nested-schemas.ts]
import { Type } from '@sinclair/typebox';
import { TypeCompiler } from '@sinclair/typebox/compiler';

// Define a schema for an Address
const AddressSchema = Type.Object({
  street: Type.String(),
  city: Type.String()
});

// User schema with nested address and tags
const UserSchema = Type.Object({
  name: Type.String(),
  address: AddressSchema, // Nested object
  tags: Type.Array(Type.String()) // Array
});

// Create and validate a user
const user = {
  name: 'Jane Doe',
  address: {
    street: '123 Main St',
    city: 'Anytown'
  },
  tags: ['developer', 'typescript']
};

const validator = TypeCompiler.Compile(UserSchema);
console.log('Valid user:', validator.Check(user));
```
In this example, you define a separate `AddressSchema` for an address and nest it inside the main `UserSchema` to represent more complex, structured data. You also include a `tags` field, which is an array of strings. 

This shows how TypeBox makes building schemas that mirror real-world data shapes with nested objects and arrays easy.

 The `user` object is then validated against the full schema using `validator.Check()`, confirming that all nested fields and array values meet the expected structure.


Run the example:

```command
npx tsx nested-schemas.ts
```

```text
[output]
Valid user: true
```

Try creating an invalid user by removing the city or putting a number in the tags array. TypeBox will catch these errors, even in nested properties, and report exactly where the problem is.

Composing schemas this way lets you build validation for increasingly complex data while maintaining both type safety and runtime validation. 


## Custom formats and validators

Sometimes the built-in validators aren't enough for your specific requirements. TypeBox allows you to create custom formats and validation rules to handle these cases.

Create a new file called `custom-validation.ts`:

```typescript
[label custom-validation.ts]
import { Type, FormatRegistry } from '@sinclair/typebox';
import { TypeCompiler } from '@sinclair/typebox/compiler';

// Register a custom format for product codes (ABC-12345)
FormatRegistry.Set('product-code', (value) => {
  return /^[A-Z]{3}-\d{5}$/.test(value);
});

// Schema using the custom format
const ProductSchema = Type.Object({
  name: Type.String(),
  code: Type.String({ format: 'product-code' }),
  price: Type.Number({ minimum: 0 })
});

// Create a product with a valid code
const product = {
  name: 'Widget',
  code: 'ABC-12345',
  price: 29.99
};

// Validate the product
const validator = TypeCompiler.Compile(ProductSchema);
console.log('Valid product:', validator.Check(product));

// Try an invalid product code
const invalidProduct = {
  name: 'Gadget',
  code: 'AB-12345', // Wrong format (only 2 letters)
  price: 19.99
};

console.log('Invalid product:', validator.Check(invalidProduct));
```

In this example, you create a custom format validator for product codes that must follow a specific pattern: three uppercase letters, a hyphen, and five digits.

The key part is using `FormatRegistry.Set()` to register a custom format validator. The validator is a function that returns `true` when the value is valid or `false` when it's not.

Run the code:

```command
npx tsx custom-validation.ts
```

```text
[output]
Valid product: true
Invalid product: false
```

Custom formats are perfect for domain-specific validation requirements like:

- Special identifiers (product codes, SKUs, etc.)
- Custom date formats
- Username or password requirements
- Business-specific rules

When TypeBox's built-in validators don't cover your specific needs, custom formats give you the flexibility to implement exactly the validation rules your application requires.

## Formatting validation errors

TypeBox gives detailed error information, but it's often too technical for end users. Let's see how to transform these errors into user-friendly messages.

Create a new file called `error-formatting.ts`:

```typescript
[label error-formatting.ts]
import { Type } from '@sinclair/typebox';
import { TypeCompiler } from '@sinclair/typebox/compiler';

// Define a schema for a registration form
const RegistrationSchema = Type.Object({
  username: Type.String({ minLength: 3, maxLength: 20 }),
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 8 }),
  age: Type.Number({ minimum: 18 })
});

// Invalid registration data
const invalidData = {
  username: 'jo', // Too short
  email: 'not-an-email',
  password: 'short',
  age: 16 // Too young
};

// Validate the data
const validator = TypeCompiler.Compile(RegistrationSchema);
const isValid = validator.Check(invalidData);

if (!isValid) {
  // Get raw errors
  const errors = [...validator.Errors(invalidData)];
  console.log('Raw validation errors:', errors);
}
```
In this example, you define a `RegistrationSchema` with several validation rules—like minimum lengths for `username` and `password`, a valid email format, and a minimum age requirement. You then create an `invalidData` object that intentionally breaks these rules.

Using `validator.Check()`, you validate the data, and when it fails, you collect and print the raw validation errors using `validator.Errors()`. The output includes detailed info about what failed, where, and why—making it easy to format or display user-friendly error messages later.

Run the example to see the raw errors:

```command
npx tsx error-formatting.ts
```

```text
[output]

Raw validation errors: [
  {
    type: 52,
    schema: {
      minLength: 3,
      maxLength: 20,
      type: 'string',
      [Symbol(TypeBox.Kind)]: 'String'
    },
    path: '/username',
    value: 'jo',
    message: 'Expected string length greater or equal to 3',
    errors: []
  },
  ...
  {
    type: 39,
    schema: { minimum: 18, type: 'number', [Symbol(TypeBox.Kind)]: 'Number' },
    path: '/age',
    value: 16,
    message: 'Expected number to be greater or equal to 18',
    errors: []
  }
]
```
As you can see, this output isn’t very user-friendly on its own.

Now, let's add a simple function to format these errors into cleaner, human-readable messages that you could display in a UI or return from an API response.

This helps users quickly understand what went wrong and how to fix it. Add the highlighted code below:


```typescript
[label error-formatting.ts]
...
if (!isValid) {
  // Get raw errors
  const errors = [...validator.Errors(invalidData)];
  
[highlight]
  // Format errors for users
  function formatErrors(errors: any[]) {
    const formatted: Record<string, string> = {};
    
    for (const error of errors) {
      // Get the field name from the path (remove leading slash)
      const field = error.path.slice(1);
      
      // Create a user-friendly message based on the error
      let message = '';
      
      if (error.message.includes('minLength')) {
        message = 'This field is too short';
      } else if (error.message.includes('maxLength')) {
        message = 'This field is too long';
      } else if (error.message.includes('minimum')) {
        message = 'This value is too small';
      } else if (error.message.includes('format')) {
        message = 'This format is invalid';
      } else if (error.message.includes('required')) {
        message = 'This field is required';
      } else {
        message = 'This field is invalid';
      }
      
      formatted[field] = message;
    }
    
    return formatted;
  }
  
  // Display user-friendly errors
  const userErrors = formatErrors(errors);
  console.log('User-friendly errors:', userErrors);
[/highlight]
}
```
In this code, you add a `formatErrors` function that takes the raw validation errors from TypeBox and turns them into simple, user-friendly messages. 

It loops through each error, extracts the field name from the `path`, and assigns a message based on the type of validation that failed (like `minLength`, `format`, or `minimum`). This lets you show clear feedback like "This field is too short" instead of a technical message. 

Finally, the formatted errors are logged as an object, making them easy to display in a UI or return in an API response.

Run the updated example to see the cleaned-up messages:

```command
npx tsx error-formatting.ts
```

```text
[output]
User-friendly errors: {
  username: 'This field is invalid',
  email: 'This format is invalid',
  password: 'This field is invalid',
  age: 'This field is invalid'
}
```


Converting TypeBox's detailed validation errors into simple messages makes your application more user-friendly while benefiting from TypeBox's powerful validation capabilities.


## Final thoughts

Throughout this guide, you've learned how to use TypeBox to create robust validation in TypeScript applications. You've explored basic schemas, constraints, type inference, optional fields, nested objects, custom formats, and error handling.

TypeBox effectively bridges compile-time type checking and runtime validation with a single schema definition. Its compiler-based approach delivers excellent performance while maintaining strong type safety.

For more advanced features and detailed API documentation, visit the [official TypeBox repository](https://github.com/sinclairzx81/typebox). As your applications grow in complexity, TypeBox's extensive capabilities can help ensure data integrity at every level while keeping your codebase clean and maintainable.