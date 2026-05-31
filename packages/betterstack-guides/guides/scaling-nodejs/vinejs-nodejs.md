# Using VineJS for Data Validation in NodeJS

[VineJS](https://vinejs.dev/docs/introduction) is a fast, lightweight validation library built for Node.js backends. The team behind AdonisJS created it, but it works with any framework.

Use VineJS to validate form data or JSON in HTTP requests before your app processes it. It focuses only on this task, so it’s faster than general-purpose libraries like Zod or Yup.

VineJS is ESM-only and supports TypeScript. It gives you both runtime checks and type safety. It also takes care of common issues with form data, like how checkboxes or empty fields are handled in HTML.

This guide shows you how to set up VineJS, use it with Express, create validation rules, and deal with validation errors.
.
[ad-logs]

## Prerequisites

To use this guide, make sure you're running Node.js version 16.0.0 or higher. VineJS uses modern JavaScript features, so older versions won't work.

VineJS is ESM-only, which means it doesn't support CommonJS. This affects how you set up your project.


## Setting up the project directory

Start with a fresh Node.js project set up for ESM modules. VineJS doesn't support CommonJS, so using ESM is required. Set up your project folder and initialize it:

```command
mkdir vinejs-demo && cd vinejs-demo
```

```command
npm init -y
```

The key step is enabling ECMAScript Modules. Since VineJS doesn’t work with `require()`, you need to set `"type": "module"` in your `package.json`:

```command
npm pkg set type=module
```

Next, install the necessary packages. You'll use Express to build the API and VineJS to handle validation:

```command
npm install express @vinejs/vine
```

This setup makes your project compatible with VineJS’s ESM-only structure, so you can use modern `import` and `export` syntax across your code.

## Creating a basic Express app without validation

Before using VineJS, let’s look at a simple Express app without any validation. This will help you understand the risks of skipping data checks. Many developers focus on making things work first, which can leave APIs open to bad or unexpected data.

Create a file called `index.js` and add this basic Express setup:

```javascript
import express from "express";
const app = express();
const PORT = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the VineJS Validation Demo!");
});

// User registration endpoint without validation
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  
  // Store user data (in a real app, this would go to a database)
  const user = { name, email, password };
  
  res.status(201).json({ 
    message: "User registered successfully", 
    user: { name, email } 
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```
This app sets up a `/register` endpoint that accepts incoming data without checking it. It simply pulls values from the request body, but doesn’t validate them. This is a common early-stage pattern, but it opens the door to serious data integrity problems.

To run the app and have it auto-restart on changes, use Node’s watch mode:

```command
node --watch index.js
```

```text
[output]
Server running on http://localhost:3000
Completed running 'index.js'
```

Let's test the endpoint with valid data first:

```command
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe", "email":"john@example.com", "password":"password123"}'
```

```text
[output]
{"message":"User registered successfully","user":{"name":"John Doe","email":"john@example.com"}}
```

If you're using Postman, create a new `POST` request to `http://localhost:3000/register`, set the `Content-Type` to `application/json`, and add the following JSON in the body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

You will get similar output:

![Screenshot of Postman output](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/5a8b5e3b-caaf-41f0-ddbf-d263ca5a5900/md2x =3248x1998)


Now, let's try completely invalid data to see how our application responds:

```command
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"name":"", "email":"not-an-email", "password":"123"}'
```

```text
[output]
{"message":"User registered successfully","user":{"name":"","email":"not-an-email"}}
```

The application accepts clearly problematic input without any objection. This naive implementation introduces several risks:

- Empty names that could break UI displays or database constraints
- Invalid email addresses that will fail delivery or verification processes
- Dangerously short passwords that compromise account security
- Potential for SQL injection if this data is used in raw queries
- No protection against malicious payloads or script injection
- Missing required fields that could cause application errors downstream

These issues highlight the need for a good validation solution like VineJS, which is specifically optimized for handling form data in Node.js applications.


## Getting started with VineJS
VineJS takes a focused approach to validation by handling only HTTP request bodies, with first-class TypeScript support built in.

To start using VineJS, update your `index.js` file like this:

```javascript
[label index.js]
import express from "express";
[highlight]
import vine from "@vinejs/vine";
[/highlight]

const app = express();
const PORT = 3000;

[highlight]
// Define validation schema using VineJS's object schema builder
const schema = vine.object({
  name: vine.string().trim().minLength(2).maxLength(50),
  email: vine.string().email(),
  password: vine.string().minLength(8)
});
[/highlight]

// Middleware to parse JSON request bodies
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the VineJS Validation Demo!");
});

// User registration endpoint with validation
[highlight]
app.post("/register", async (req, res) => {
  try {
    // VineJS returns a Promise, so we use await here
    const validatedData = await vine.validate({ schema, data: req.body });

    // Process validated data
    res.status(201).json({
      message: "User registered successfully",
      user: {
        name: validatedData.name,
        email: validatedData.email
      }
    });
  } catch (error) {
    // Handle validation errors
    return res.status(400).json({ errors: error.messages });
  }
[highlight]

});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

This implementation uses VineJS's core features:

1. Schema definition using the fluent API with chainable methods
2. Asynchronous validation with automatic error handling
3. Type safety for the validated output (in TypeScript projects)
4. Automatic error formatting with detailed field-specific messages

Save the changes and test the endpoint with our previously invalid data:

```command
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"name":"", "email":"not-an-email", "password":"123"}'
```

This time, VineJS intercepts the invalid input and generates a structured error response:

```text
[output]
{"errors":[{"message":"The name field must have at least 2 characters","rule":"minLength","field":"name","meta":{"min":2}},{"message":"The email field must be a valid email address","rule":"email","field":"email"},{"message":"The password field must have at least 8 characters","rule":"minLength","field":"password","meta":{"min":8}}]}            
```

If you're using Postman, the response will look similar to this when you send invalid data:

![Screenshot showing postman error response](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/0126b17e-7785-42de-78e7-b20bcea2a600/lg2x =3248x1998)

The response now includes specific validation failures for each field, guiding the client on exactly what needs correction. Unlike some validation libraries that return at the first error encountered, VineJS collects all validation errors in a single pass, providing a comprehensive overview of input issues.



## Understanding VineJS validation chains

VineJS builds validation logic through schema chains that define both data structure and validation rules. Unlike annotation-based validators, VineJS uses a fluent API where each method narrows down what data is acceptable.

### Basic validation chains

Every validation in VineJS starts with a schema type that sets the foundation for the data's nature. Each schema type then offers specific validators and modifiers:

```javascript
[label index.js]
import express from "express";
import vine from "@vinejs/vine";
[highlight]
import { SimpleMessagesProvider } from "@vinejs/vine";
[/highlight]

const app = express();
const PORT = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Define validation schema at the top level of your file
const schema = vine.object({
  name: vine
    .string()
    .trim()
    .minLength(2)
    .maxLength(50),
  
  email: vine
    .string()
    .trim()
    .email()
[highlight]
    .normalizeEmail(),
[/highlight]
  
  password: vine
    .string()
    .minLength(8)
[highlight]
    .maxLength(100)
    .regex(/[A-Z]/)
    .regex(/[0-9]/),
    
  password_confirmation: vine
    .string()
[/highlight]
});

[highlight]
// Define custom messages
vine.messagesProvider = new SimpleMessagesProvider({
  minLength: 'The {{ field }} field must have at least {{ min }} characters',
  maxLength: 'The {{ field }} field must not be greater than {{ max }} characters',
  email: 'Please provide a valid email address',
  regex: 'The {{ field }} field format is invalid'
});
[/highlight]

app.get("/", (req, res) => {
  res.send("Welcome to the VineJS Validation Demo!");
});

// User registration endpoint with validation
app.post("/register", async (req, res) => {
  try {
    [highlight]
    // Pre-compile the schema for performance optimization
    const validator = vine.compile(schema);
    const validatedData = await validator.validate(req.body);
    [/highlight]
    
    // Work with validated data, which now matches the schema exactly
    res.status(201).json({ 
      message: "Registration successful", 
      user: { 
        name: validatedData.name, 
        email: validatedData.email 
      } 
    });
  } catch (error) {
    return res.status(400).json({ errors: error.messages });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

VineJS's clear separation between **data transformation** and **validation**sets it apart. Modifiers like `trim()` change the input, while validators like `email()` simply check the value without altering it.

Here are some key features of this setup:

* The `password_confirmation` field automatically matches against the `password` field.
* The schema is compiled into efficient JavaScript, making it fast for repeated validation.
* You can define custom error messages globally using the `messagesProvider`.
* VineJS validates all fields in one go, collecting every error instead of stopping at the first failure.

When you test with invalid input, VineJS returns a full list of validation issues in a single response:

```command
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"name":"J", "email":"not-an-email", "password":"password"}'
```

The response includes errors for all fields with validation failures:

```text
[output]
{"errors":[{"message":"The name field must have at least 2 characters","rule":"minLength","field":"name","meta":{"min":2}},{"message":"Please provide a valid email address","rule":"email","field":"email"},{"message":"The password field format is invalid","rule":"regex","field":"password"},{"message":"The password_confirmation field must be defined","rule":"required","field":"password_confirmation"}]}
```

If you're using Postman, the response will look similar to this when you submit invalid data:

![Screenshot showing validation errors in Postman](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/f34359e6-0407-4c3e-bf9b-4075ac09f100/lg2x =3248x1998)



## Validating nested objects and arrays

As your app grows, you'll often need to validate nested objects and arrays. VineJS makes this straightforward using its fluent schema syntax.

Here’s how you can validate a user profile with an address object and a list of skills:

```javascript
[label index.js]
import express from "express";
import vine from "@vinejs/vine";

const app = express();
const PORT = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

[highlight]
// Define a schema with nested object and array validation
const schema = vine.object({
  name: vine.string().trim().minLength(2).maxLength(50),
  email: vine.string().email().normalizeEmail(),
  password: vine
    .string()
    .minLength(8)
    .maxLength(100)
    .regex(/[A-Z]/)
    .regex(/[0-9]/),

  password_confirmation: vine.string(),
[highlight]
  address: vine.object({
    street: vine.string().minLength(3),
    city: vine.string().minLength(2),
    zip: vine.string().regex(/^\d{5}$/)
  }),
  skills: vine.array(vine.string().minLength(2)).minLength(1)
[/highlight]

});
...
```
In this code, you validate nested data structures using VineJS. The `address` field is a nested object with its own rules for `street`, `city`, and `zip`, ensuring structured and valid location data. 

The `skills` field is an array where each item must be a string of at least 2 characters, and the array must contain at least one item. This shows how VineJS cleanly handles nested objects and arrays within a single schema.


Now test with valid data:

```command
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane",
    "email": "jane@example.com",
    "password": "Password123",
    "password_confirmation": "Password123",
    "address": {
      "street": "123 Main St",
      "city": "Springfield",
      "zip": "12345"
    },
    "skills": ["JavaScript", "Node.js"]
  }'
```

You will see output that looks like this:

```text
[output]
{"message":"User registered successfully","user":{"name":"Jane","email":"jane@example.com"}}
```

Now test with invalid data:

```command
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "J",
    "email": "invalid-email",
    "password": "pass",
    "password_confirmation": "",
    "address": {
      "street": "",
      "city": "",
      "zip": "abc"
    },
    "skills": []
  }'
```

You will receive output similar to this:

```text
[output]
...
{"message":"The street field must have at least 3 characters","rule":"minLength","field":"address.street","meta":{"min":3}},{"message":"The city field must have at least 2 characters","rule":"minLength","field":"address.city","meta":{"min":2}},{"message":"The zip field format is invalid","rule":"regex","field":"address.zip"},{"message":"The skills field must have at least 1 items","rule":"array.minLength","field":"skills","meta":{"min":1}}]}
```

If you're using Postman, this structured error response will appear clearly in the response body, showing all nested field errors in detail:


![Screenshot of the error message in postman](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/a5cea214-e8bd-413c-0071-703afc78f900/lg2x =3248x1998)

That takes care of using VineJS to validate nested objects and arrays.


## Final thoughts

VineJS makes it easy to validate data in Node.js apps. You can define clear rules for fields, nested objects, arrays, and even conditional logic. 

It runs fast, supports TypeScript, and keeps your code clean and easy to maintain. Whether you're building simple forms or complex APIs, VineJS helps you catch bad data early.

 To learn more, visit the [official VineJS documentation](https://vinejs.dev/docs/introduction).
