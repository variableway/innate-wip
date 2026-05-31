# A Complete Guide to Joi

[Joi](https://joi.dev/) is a well-known JavaScript library used to define and validate data schemas, helping you ensure that the data your app receives is clean, accurate, and in the right format.

Joi doesn’t do type checking like TypeScript—it focuses on runtime validation. That means it checks your data while your app runs, not just during development.

You can create flexible and detailed rules, handle complex validation logic, and customize error messages to fit your needs. 

In this guide, you’ll learn how to build reliable validation systems using Joi. We’ll walk through creating schemas, validating data, handling errors effectively, and integrating Joi with TypeScript for added type safety.

[ad-logs]

## Prerequisites

To follow this guide, ensure you have a recent version of [Node.js](https://nodejs.org/en/download/) and `npm` installed on your machine. Some examples use TypeScript, so it helps to be somewhat familiar with [TypeScript basics](https://www.typescriptlang.org/docs/handbook/intro.html), but it’s not required to understand how Joi works.


## Setting up the project directory

In this section, you'll set up a modern JavaScript project using ES modules. This structure follows current best practices and gives you a clean working starting point with Joi.

 
First, create a dedicated project directory and navigate into it:

```command
mkdir joi-validation && cd joi-validation
```

Initialize a new npm project with default settings:

```command
npm init -y
```

Configure the project to use ECMAScript modules instead of CommonJS:

```command
npm pkg set type=module
```

Now, install [Joi](https://www.npmjs.com/package/joi) as the main dependency, along with [TypeScript](https://www.npmjs.com/package/typescript) and [tsx](https://www.npmjs.com/package/tsx) for a better development experience:

```command
npm install joi
```

```command
npm install --save-dev typescript tsx
```

Each of these plays a specific role in your workflow:

- `joi`: The data validation library you'll use throughout the tutorial  
- `typescript`: Adds static type checking to your code  
- `tsx`: Lets you run TypeScript files directly without needing to compile them first  

Next, generate a basic TypeScript configuration file with recommended settings:


```command
npx tsc --init
```

To simplify the development workflow, update your `package.json` with convenient run scripts:

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

With this setup, you can work in either TypeScript or JavaScript, depending on your preference. 


## Getting started with Joi

Joi is built around the idea of writing clear, chainable validation rules that describe exactly what your data should look like. Unlike some libraries that separate types and validation logic, Joi combines them into a single, readable schema. This makes it easy to catch invalid data right away.

To see how it works, let’s create a simple Joi schema. Make a file called `validation.js` and add the following code:

```javascript
[label validation.js]
import Joi from 'joi';

const userSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  age: Joi.number().integer().min(18).required(),
});

export default userSchema;
```

This schema defines validation rules for a user object with three fields:

- `username`: Must be an alphanumeric string between 3-30 characters
- `email`: Must be a valid email address format
- `age`: Must be an integer of at least 18

Each validation rule is built through method chaining, creating a clear, readable definition of your data requirements. The `.required()` method ensures the field must be present in the validated data.

To apply this schema, create an `index.js` file with validation logic:

```javascript
[label index.js]
import userSchema from './validation.js';

const userData = {
  username: 'johndoe',
  email: 'john.doe@example.com',
  age: 25
};

const result = userSchema.validate(userData);

if (result.error) {
  console.error('Validation error:', result.error.message);
} else {
  console.log('Valid user data:', result.value);
}
```

Joi returns a result object that contains either the validated data or error details. This gives you full control over how to handle validation failures and makes it easier to integrate with your application's error-handling logic.

Now run the script:


```command
npm run dev:js
```

The output confirms successful validation:

```text
[output]
Valid user data: { username: 'johndoe', email: 'john.doe@example.com', age: 25 }
```

This basic example demonstrates Joi's straightforward approach to validation. Next, we'll explore how to create more sophisticated validation rules tailored to specific requirements.


## Customizing validations in Joi

Joi shines when it comes to handling more complex validation needs. Its flexible, chainable API lets you go far beyond basic type checks. 

You can easily add constraints, apply custom logic, and define helpful error messages that make validation more informative and user-friendly.


### Adding constraints with custom error messages

Let’s enhance our user schema by adding stricter rules and custom error messages to show how Joi can be tailored to fit real-world requirements:


```javascript
[label validation.js]
import Joi from 'joi';

const userSchema = Joi.object({
[highlight]
  username: Joi.string().alphanum().min(3).max(30).required().messages({
    'string.min': 'Username must have at least 3 characters',
    'string.max': 'Username cannot exceed 30 characters',
    'string.empty': 'Username cannot be empty',
    'any.required': 'Username is required',
  }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),
  age: Joi.number().integer().min(18).required().messages({
    'number.base': 'Age must be a number',
    'number.integer': 'Age must be an integer',
    'number.min': 'You must be at least 18 years old',
    'any.required': 'Age is required',
  }),
[/highlight]
});

export default userSchema;
```

This example shows how Joi lets you customize error messages in two ways:

1. **Inline messages** — These are passed directly into methods like `.min()` and `.max()`, which override the default messages for that specific constraint.
2. **Message mapping with `.messages()`** — This method gives you precise control over Joi’s internal error codes, like `'string.empty'` for blank inputs or `'any.required'` for missing fields.

Using `.messages()` is especially useful when you want consistent, user-friendly feedback tied to specific types of validation errors.

For email validation, the option `{ tlds: { allow: false } }` makes the check less strict by allowing any domain, while still ensuring the email format is valid.

Now let’s test these validations with some invalid data to see how Joi responds:

```javascript
[label index.js]
import userSchema from './validation.js';

[highlight]
const invalidUserData = {
  username: 'j',  // Too short
  email: 'not-an-email',  // Invalid format
  age: 16  // Under 18
};

const result = userSchema.validate(invalidUserData);
[/highlight]

if (result.error) {
  console.error('Validation error:', result.error.message);
} else {
  console.log('Valid user data:', result.value);
}
```

Joi employs an "early failure" approach by default, returning only the first validation error it encounters. Running this script shows:

```command
npm run dev:js
```

```text
[output]
Validation error: "username" must have at least 3 characters
```
As you can see, only the first error is reported.

 In many cases—especially in form or API validation—you’ll want to collect all errors at once. Joi supports this with the `abortEarly` option:

```javascript
[label index.js]
...
[highlight]
const result = userSchema.validate(invalidUserData, { abortEarly: false });
[/highlight]

if (result.error) {
[highlight]
  console.error('Validation errors:');
  result.error.details.forEach(detail => {
    console.error(`- ${detail.message}`);
  });
[/highlight]
} else {
  console.log('Valid user data:', result.value);
}
```

With `abortEarly: false`, Joi continues validation even after encountering errors, collecting all validation issues into the `details` array. The output now shows all validation problems:

```text
[output]
Validation errors:
- Username must have at least 3 characters
- Please provide a valid email address
- You must be at least 18 years old
```

This comprehensive error reporting helps users correct all issues simultaneously rather than address them sequentially.

### Conditional validation

Joi makes it easy to define rules that change based on other values in the data. This is useful when specific fields are required or behave differently depending on the context.

Let’s update the schema to include a `role` field, and apply conditional logic so that if the role is `'admin'`, an additional `accessCode` field becomes required:


```javascript
[label validation.js]
import Joi from 'joi';

const userSchema = Joi.object({
  username: Joi.string()
    ....
    }),
  email: Joi.string()
    ...
    }),
  age: Joi.number()
    ....
    }),
[highlight]
  role: Joi.string()
    .valid('user', 'admin', 'moderator')
    .default('user'),
  permissions: Joi.when('role', {
    is: 'admin',
    then: Joi.array().items(Joi.string()).min(1).required()
      .messages({
        'any.required': 'Permissions are required for admin users',
        'array.min': 'At least one permission is required for admin users'
      }),
    otherwise: Joi.forbidden()
  })
[/highlight]
});

export default userSchema;
```

This schema introduces two new fields with a conditional relationship:

- `role`: Must be one of the allowed values, with `'user'` set as the default  
- `permissions`: Only required when `role` is `'admin'`, and explicitly forbidden for other roles

The `.when()` method sets up this relationship by adjusting validation rules based on the value of the `role` field. If the role is `'admin'`, `permissions` must be a non-empty array of strings. For any other role, the presence of `permissions` will trigger a validation error.

Also, note that error messages are now defined using the correct error type keys inside the `.messages()` method, rather than passing messages directly into methods like `.min()`.

Now, let’s test how this conditional validation behaves with different inputs. Clear the contents of `index.js` and add the following code:

```javascript
[label index.js]
import userSchema from './validation.js';

// Admin without permissions (should fail)
const adminWithoutPermissions = {
  username: 'admin_user',
  email: 'admin@example.com',
  age: 30,
  role: 'admin'
};

// Regular user with permissions (should fail)
const regularUserWithPermissions = {
  username: 'regular_user',
  email: 'user@example.com',
  age: 25,
  role: 'user',
  permissions: ['read']
};

// Valid admin with permissions
const validAdmin = {
  username: 'valid_admin',
  email: 'valid.admin@example.com',
  age: 35,
  role: 'admin',
  permissions: ['read', 'write', 'delete']
};

console.log('Admin without permissions:');
console.log(userSchema.validate(adminWithoutPermissions, { abortEarly: false }).error?.message || 'Valid');

console.log('\nRegular user with permissions:');
console.log(userSchema.validate(regularUserWithPermissions, { abortEarly: false }).error?.message || 'Valid');

console.log('\nValid admin:');
console.log(userSchema.validate(validAdmin, { abortEarly: false }).error?.message || 'Valid');
```
In this code, you test three different user objects to see how Joi handles conditional validation based on the `role` field. Each case is validated using `userSchema.validate()` with `{ abortEarly: false }` to ensure all errors are reported at once.

Running this script shows how Joi enforces different validation rules depending on the role:

```text
[output]
> node index.js

Admin without permissions:
"username" must only contain alpha-numeric characters. Permissions are required for admin users

Regular user with permissions:
"username" must only contain alpha-numeric characters. "permissions" is not allowed

Valid admin:
"username" must only contain alpha-numeric characters
```

This conditional validation capability makes Joi exceptionally well-suited for complex business logic where field requirements vary based on other data values. Beyond the simple example shown here, Joi supports complex conditions using `when()` with multiple fields, alternative conditions, and nested dependencies.



## Handling errors gracefully in Joi

When validating data in real applications, how you present validation errors can significantly impact the user experience.

Joi gives you detailed information when validation fails, but turning those technical details into clear, helpful messages takes some extra work. 

### Understanding Joi's error structure

Joi’s error objects include a lot of useful details about what went wrong, where, and why. 

To get familiar with this structure, modify the `index.js` file and replace its contents with the following code to inspect a real Joi error:

```javascript
[label index.js]
import userSchema from './validation.js';

const invalidData = {
  username: 'j@',  // Too short and contains special characters
  email: 'invalid',  // Invalid format
  age: 16  // Under 18
};

const result = userSchema.validate(invalidData, { abortEarly: false });

if (result.error) {
  // Log the full error object structure
  console.log('Error object structure:');
  console.log(JSON.stringify(result.error, null, 2).substring(0, 500) + '...');
  
  // Log details of the first error
  console.log('\nFirst error detail:');
  const firstError = result.error.details[0];
  console.log(`- Path: ${firstError.path.join('.')}`);
  console.log(`- Type: ${firstError.type}`);
  console.log(`- Message: ${firstError.message}`);
  console.log(`- Context:`, firstError.context);
}
```
This code runs validation against invalid input to trigger Joi’s error output. It logs part of the full error object and then prints key details from the first validation error. With `abortEarly: false`, Joi returns all validation issues at once. This helps you understand how to extract and present meaningful error messages from Joi’s detailed error structure.

Now run the script:

```command
npm run dev:js         
```


You’ll see output similar to:

```text
[output]

Error object structure:
{
  "_original": {
    "username": "j@",
    "email": "invalid",
    "age": 16
  },
  "details": [
    {
      "message": "\"username\" must only contain alpha-numeric characters",
      "path": [
        "username"
      ],
      "type": "string.alphanum",
      "context": {
        "label": "username",
        "value": "j@",
        "key": "username"
      }
    },
    {
      "message": "Username must have at least 3 characters",
      "path": [
        "username"
      ],
      "type": "stri...

First error detail:
- Path: username
- Type: string.alphanum
- Message: "username" must only contain alpha-numeric characters
- Context: { label: 'username', value: 'j@', key: 'username' }
```

The `error` object contains the original data that failed validation and an array of `details` with specific information about each validation failure. Each detail includes:

- The field path that failed (could be nested like `user.address.city`)
- The specific validation rule type that failed (like `string.min` or `number.base`)
- A human-readable error message
- Context with additional information about the rule that failed

This rich structure gives you everything needed to provide meaningful feedback, but it's often more detailed than what you want to show to users.


### Creating user-friendly error messages

For most applications, you'll want to display clean and user-friendly error messages. Instead of showing Joi's full error object, it’s better to map each field to a single, clear message.

To do that, let’s add a helper function to your `index.js` file that transforms Joi’s error output into a simpler format:

```javascript
[label index.js]
import userSchema from './validation.js';
[highlight]
// Helper function to format Joi errors
function formatJoiErrors(error) {
  if (!error || !error.details) return {};

  return error.details.reduce((result, detail) => {
    const key = detail.path.join('.');
    
    // Only keep the first error for each field
    if (!result[key]) {
      result[key] = detail.message;
    }
    
    return result;
  }, {});
}
[/highlight]


const invalidData = {
  username: 'j@',
  email: 'invalid',
  age: 16
};

const result = userSchema.validate(invalidData, { abortEarly: false });

if (result.error) {
[highlight]
  const formattedErrors = formatJoiErrors(result.error);
  console.log('Validation errors by field:');
  console.log(formattedErrors);
} else {
  console.log('Valid data:', result.value);
}
[/highlight]
```
The first highlighted block adds a `formatJoiErrors` helper function that takes Joi’s detailed error object and converts it into a simpler object where each field maps to its first error message.

The second highlighted block uses that helper to transform and log the validation errors in a clean, readable format, showing only one message per field.

Running this script with `npm run dev:js` will produce:

```text
[output]
Validation errors by field:
{
  username: '"username" must only contain alpha-numeric characters',
  email: 'Please provide a valid email address',
  age: 'You must be at least 18 years old'
}
```

This format is much easier to work with in your application code. For form validation, you can directly map these errors to specific fields. For API responses, you can include this object in the response to help clients understand what needs to be fixed.

For nested data structures, the formatter preserves the path using dot notation. For example, if you were validating an address with a city field, and the city was invalid, the key in your formatted errors would be `address.city`.



## TypeScript integration with Joi

To take full advantage of Joi in a TypeScript project, you’ll want to combine runtime validation with compile-time type safety. In this section, you’ll use Joi with TypeScript to build a more reliable validation system.

Joi doesn’t auto-generate TypeScript types from its schemas, so you’ll need to define types that match your validation rules manually. This gives you flexibility and control, but also means you'll need to keep your types and validation logic in sync.

To get started, rename your `validation.js` file to `validation.ts`, and update your schema with TypeScript types:

```typescript
[label validation.ts]
import Joi from 'joi';

const userSchema = Joi.object({
  ...
});

[highlight]
// Define a TypeScript interface that matches the schema
interface User {
  username: string;
  email: string;
  age: number;
  role?: 'user' | 'admin' | 'moderator';
  permissions?: string[];
}

export { userSchema, type User };
[/highlight]
```

Notice how you’ve added a TypeScript interface that matches your Joi schema. This interface helps you catch type errors during development, ensuring any objects you create follow the expected structure. Joi then takes care of validating the data at runtime.

Now, go ahead and clear the contents of your file, rename it to `.ts`, and add the following validation example using your new TypeScript type:

```typescript
[label index.ts]
import { userSchema, type User } from './validation';

// TypeScript helps ensure we're creating a valid user
const userData: User = {
  username: 'johndoe',
  email: 'john.doe@example.com',
  age: 25,
  role: 'admin',
  permissions: ['read', 'write']
};

const result = userSchema.validate(userData);

if (result.error) {
  console.error('Validation error:', result.error.message);
} else {
  // After validation, we know result.value is a valid User
  const validUser: User = result.value;
  console.log('Valid user data:', validUser);
}
```
Most of the code should look familiar. What’s different now is that you’ve added a `User` type from your Joi schema file, and you’re explicitly telling TypeScript what kind of data you expect. 

This gives you compile-time safety when creating and working with your data, while Joi still handles the actual validation at runtime.

With this approach, you get instant TypeScript feedback while writing code. If you try to create a user object with missing fields or wrong types, your editor will flag the issue right away—before the code even runs.

To run this TypeScript example, use:

```command
npm run dev
```

You should see a successful validation output:

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
Those changes let you combine the best of both worlds—you can catch type issues early with TypeScript and still rely on Joi to validate real data at runtime.

You can confidently work with your objects knowing they meet your static and runtime expectations.


## Final thoughts

In this guide, you learned how to use Joi to validate data effectively in JavaScript and TypeScript projects. From basic schemas to custom messages and conditional rules, Joi gives you powerful tools to keep your data clean and reliable.

We also showed how to pair Joi with TypeScript for better safety during development, even though you'll need to sync types manually. If you're looking for a library that combines validation and type inference out of the box, consider exploring [Zod](https://betterstack.com/community/guides/scaling-nodejs/zod-explained/) as an alternative.

Whichever you choose, solid validation helps catch bugs early and improves the overall user experience.
