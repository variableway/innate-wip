# JSON Schema Validation with Ajv

[Ajv](https://ajv.js.org/) is a powerful JSON validator for JavaScript. It makes sure your data follows the structure you want. It works quickly by transforming schemas into optimized JavaScript functions, making it one of the fastest validators available.

The library checks everything from basic types to complex formats. It can handle conditional validation and custom rules too. Because it's so fast and thorough, Ajv has become the go-to validator for Node.js projects.

In this guide, you'll learn how to set up Ajv, create schemas, validate data, and add your own validation rules.

[ad-logs]

## Prequisites

Before starting, make sure you have Node.js version 22.0 or higher installed. Ajv uses modern JavaScript features, so you need an up-to-date version.

Check your Node.js version by running:

```command
node --version
```
```text
[output]
Now using node v22.14.0 (npm v10.9.2)
```


## Setting up your project

Let's set up a project folder and install the necessary components. Having a dedicated project helps keep your validation code organized and maintainable.

Create a new directory and move into it:

```command
mkdir ajv-demo && cd ajv-demo
```

Start a new Node.js project:

```command
npm init -y
```

Set up your project to use ES modules:

```command
npm pkg set type=module
```

Install Ajv and the formats package:

```command
npm install ajv ajv-formats
```

Test that Ajv installed correctly by creating a test file:

```command
touch test-ajv.js
```

Add this code to the file:

```javascript
[label test-ajv.js]
import Ajv from "ajv";
const ajv = new Ajv();

console.log("Ajv version:", ajv.opts.code.es5 ? "Using ES5 code" : "Using ES6+ code");
```

Run the file to check:

```command
node test-ajv.js
```

If you see something like:

```text
[output]
Ajv version: Using ES6+ code
```

Then Ajv is installed and ready to use.

## Getting started with Ajv

Now that we've seen a basic example, let's take a closer look at how the validation process unfolds step by step.

The following sequence diagram shows the interaction between the developer, Ajv, and the validation function, highlighting the three key phases: initial setup, schema compilation, and data validation:

![Sequence diagram showing the Ajv validation process. It illustrates the interactions between Developer, Schema, Ajv, ValidateFunction, and InputData](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/49792ddb-e53b-4a27-07bf-aed22c434400/md1x =1256x1248)

Understanding this sequence will help you work more effectively with Ajv in your applications.

Ajv checks if your JSON data matches the structure you defined. It makes special JavaScript functions from your schemas to validate data quickly.

Let's create your first validation. Make a file called `main.js` and add this code:

```javascript
[label main.js]
import Ajv from "ajv";
const ajv = new Ajv();

// Define a schema
const schema = {
  type: "object",
  properties: {
    name: { type: "string" },
    age: { type: "integer" }
  },
  required: ["name", "age"],
  additionalProperties: false
};

// Validate data
const validate = ajv.compile(schema);
const validData = { name: "Alice", age: 30 };
const valid = validate(validData);

if (valid) {
  console.log("Data is valid!");
} else {
  console.log("Validation errors:", validate.errors);
}
```

This code uses the Ajv library to validate data based on a defined schema. It creates a schema that checks if the data has a `name` (string) and `age` (integer) and ensures that no extra properties are present.

 The code then checks if the data `({ name: "Alice", age: 30 })` meets the requirements of the schema. If the data is valid, it prints `"Data is valid!"` Otherwise, it shows the validation errors.

Run the script:

```command
node main.js
```

You'll see:

```text
[output]
Data is valid!
```

What happens when the data doesn't match? Try this:

```javascript
[label main.js]
....
// Data to validate
[highlight]
const invalidData = {
  name: "Alice",
  age: "thirty"
};

// Perform validation
const valid = validate(invalidData);
[/highlight]

if (valid) {
  console.log("Data is valid!");
} else {
  console.log("Validation errors:", validate.errors);
}
```

Rerun it, and you'll see:

```text
[output]
Validation errors: [
  {
    instancePath: '/age',
    schemaPath: '#/properties/age/type',
    keyword: 'type',
    params: { type: 'integer' },
    message: 'must be integer'
  }
]
```

Unlike some other tools, Ajv doesn't automatically convert types. Even if you try with a number as a string:

```javascript
[label main.js]
...
[highlight]
const almostValidData = {
  name: "Alice",
  age: "30"  // Age is a string, not an integer
};

// Perform validation
const valid = validate(almostValidData);
[/highlight]

if (valid) {
  console.log("Data is valid!");
} else {
  console.log("Validation errors:", validate.errors);
}
```

You'll still get an error because `"30"` is a string, not an integer.

If you want Ajv to convert types for you, you can set that up:

```javascript
[label main.js]
import Ajv from "ajv";
[highlight]
const ajv = new Ajv({ coerceTypes: true });
[/highlight]

// Rest of the code stays the same
```

Upon running the file, you will see:

```text
[output]
Data is valid!
```
Now, let's examine how to add rules to refine your validation.


## Adding rules to your schemas

Basic type checking is often not enough. You typically need additional rules to maintain high-quality data. Ajv gives you many validators to set these rules.

Update your schema with more specific rules:

```javascript
[label main.js]
import Ajv from "ajv";
[highlight]
import addFormats from "ajv-formats";

const ajv = new Ajv({ allErrors: true });
addFormats(ajv); // Add format validators
[/highlight]

// Schema with rules
const schema = {
  type: "object",
  properties: {
[highlight]
    name: { type: "string", minLength: 2, maxLength: 50 },
    age: { type: "integer", minimum: 1, maximum: 120 },
    email: { type: "string", format: "email" }
[/highlight]
  },
[highlight]
  required: ["name", "age", "email"],
[/highlight]
  additionalProperties: false
};

// Validate data
const validate = ajv.compile(schema);
[highlight]
const user = { name: "Alice", age: 30, email: "alice@example.com" };
const valid = validate(user);
[/highlight]

if (valid) {
  console.log("Data is valid!");
} else {
  console.log("Validation errors:", validate.errors);
}
```

Now, each field has specific rules: the name must be between 2 and 50 characters, the age must be between 1 and 120, and the email must be in a valid email format.

We've also enabled the `allErrors` option, which finds all errors simultaneously instead of stopping at the first one.

When you run the file, you will see no issues:

```command
node main.js
```
```text
[output]
Data is valid!
```

Try data that breaks these rules:

```javascript
[label main.js]
...
[highlight]
const user = {
  name: "A",
  age: -5,
  email: "invalid-email"
};
[/highlight]
const valid = validate(user);
...
```

When you run the file, you'll get errors for all three fields:

```text
[output]
Validation errors: [
  {
    instancePath: '/name',
    schemaPath: '#/properties/name/minLength',
    keyword: 'minLength',
    params: { limit: 2 },
    message: 'must NOT have fewer than 2 characters'
  },
  {
    instancePath: '/age',
    schemaPath: '#/properties/age/minimum',
    keyword: 'minimum',
    params: { comparison: '>=', limit: 1 },
    message: 'must be >= 1'
  },
  {
    instancePath: '/email',
    schemaPath: '#/properties/email/format',
    keyword: 'format',
    params: { format: 'email' },
    message: 'must match format "email"'
  }
]
```

Checking early helps catch problems before they cause issues in your application.

Sometimes you want to make fields optional. By default, all properties in a JSON Schema are optional unless you list them in the `required` array.

To make some fields optional:

```javascript
[label main.js]
const schema = {
  type: "object",
  properties: {
    name: { type: "string", minLength: 2, maxLength: 50 },
    age: { type: "integer", minimum: 1, maximum: 120 },
    email: { type: "string", format: "email" },
[highlight]
    isActive: { type: "boolean", default: true }
[/highlight]
  },
[highlight]
  required: ["name", "age"],  // Email is now optional
[/highlight]
  additionalProperties: false
};

...
const validate = ajv.compile(schema);
// Data without email
[highlight]
const user = {
  name: "Bob",
  age: 25
};
[/highlight]
...
```

Now data without an email is still valid:

```text
[output]
Data is valid!
```

You can also set default values for missing fields. To make Ajv use these defaults, enable the `useDefaults` option:

```javascript
import Ajv from "ajv";
const ajv = new Ajv({ 
  allErrors: true,
[highlight]
  useDefaults: true  // Enable default values
[/highlight]
});
```

Now when a field with a default value is missing, Ajv adds it automatically:

```javascript
// Data without isActive
const user = {
  name: "Charlie",
  age: 28,
  email: "charlie@example.com"
};

// After validation
console.log("User with defaults:", user);
```

You'll see:

```text
[output]
User with defaults: { name: 'Charlie', age: 28, email: 'charlie@example.com', isActive: true }
```

The `isActive` property was set to `true` automatically.

## Creating custom validation rules

Sometimes the built-in rules aren't enough. You might need special validation for things like:

- Username formats
- Password requirements
- Date ranges
- Relationships between fields

Ajv lets you create custom keywords for these special cases.

The diagram below outlines the process of creating and registering a custom keyword with Ajv, with a password complexity validator as a practical example. This flowchart breaks down the steps we'll implement in the code that follows:

![This flowchart breaks down the process of creating custom keywords, with an example of the password complexity validation](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/b4570b22-0d31-4fe9-a069-fe0d450b7f00/lg2x =792x1284)


Here's how to add a password validation rule:

```javascript
[label main.js]
import Ajv from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);  // Add format validators

[highlight]
// Custom password validation
ajv.addKeyword({
  keyword: "passwordComplexity",
  type: "string",
  validate: function(schema, data) {
    // Check for uppercase, lowercase, and number
    const hasUpperCase = /[A-Z]/.test(data);
    const hasLowerCase = /[a-z]/.test(data);
    const hasNumber = /[0-9]/.test(data);
    
    const valid = hasUpperCase && hasLowerCase && hasNumber;
    
    if (!valid) {
      validate.errors = [{
        keyword: "passwordComplexity",
        message: "Password must contain uppercase, lowercase, and number",
        params: { keyword: "passwordComplexity" }
      }];
    }
    
    return valid;
  }
});
[/highlight]

// Schema with custom keyword
const schema = {
  type: "object",
  properties: {
[highlight]
    username: { type: "string", minLength: 3, maxLength: 20 },
    password: { type: "string", minLength: 8, passwordComplexity: true }
[/highlight]
  },
[highlight]
  required: ["username", "password"],
[/highlight]
  additionalProperties: false
};

// Validate data
const validate = ajv.compile(schema);
[highlight]
const validUser = { username: "alice123", password: "Secure123" };
const valid = validate(validUser);
[/highlight]

if (valid) {
  console.log("User data is valid!");
} else {
  console.log("Validation errors:", validate.errors);
}
```

The highlighted code adds a custom password validation rule that checks if the password contains at least one uppercase letter, one lowercase letter, and one number. 

This is done by defining a custom validation keyword called `passwordComplexity`. In the schema, the `password` field uses this keyword along with a requirement that the password must be at least 8 characters long. 

The code then validates the user data, `{ username: "alice123", password: "Secure123" }`, against the schema. If the data meets all the requirements, it prints "User data is valid!". Otherwise, it outputs any validation errors.

Now, run the following command:

```command
node main.js
```
```text
[output]
Data is valid!
```

Now try an invalid password:

```javascript
[label main.js]
...
[highlight]
const invalidUser = {
  username: "bob456",
  password: "weakpass"
};
const valid = validate(invalidUser);
[/highlight]
if (valid) {
  console.log("User data is valid!");
} else {
  console.log("Validation errors:", validate.errors);
}
```

You'll get:

```text
[output]
Validation errors: [
  {
    instancePath: '/password',
    schemaPath: '#/properties/password/passwordComplexity',
    keyword: 'passwordComplexity',
    params: {},
    message: 'must pass "passwordComplexity" keyword validation'
  }
]
```
This output indicates that the password failed the custom validation rule defined in the schema, `passwordComplexity`.

The validation checks whether the password contains at least one uppercase letter, one lowercase letter, and one number. Since the password `"weakpass"` doesn't meet these criteria, it fails the validation, and the error message is displayed.

Custom rules enable you to create the exact validation you need for your specific use case.

## Final thoughts

In this guide, we show you how to set up Ajv, create rules, and verify data, including how to make your own rules, such as checking password complexity. 

To learn more about Ajv and how to use it, check out the official [Ajv documentation](https://ajv.js.org/).
