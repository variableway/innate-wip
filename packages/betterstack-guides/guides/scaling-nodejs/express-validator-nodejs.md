# Using Express-Validator for Data Validation in Node.js

[`express-validator`](https://express-validator.github.io/) is a valuable library for checking and cleaning up data in Node.js apps, especially if you're using [Express](https://expressjs.com/). It helps ensure the data you get from users is safe and in the right format.

It’s built on top of `validator.js` and gives you a wide range of tools—from simple checks like making sure something is a number, to more complex rules like matching a specific pattern. You can also add your own custom checks.

This guide will show you how to set up `express-validator`, use it with Express, create different kinds of validation rules, and deal with errors when validation fails.

[ad-logs]

## Prerequisites

Before you start, make sure you have a recent version of [Node.js](https://nodejs.org/en/download/) and `npm` installed. This guide assumes you already know the basics of building an Express app.

## Setting up the project directory

In this part, you'll set up a simple Express app and prepare it to use `express-validator`.

Start by creating a new directory for your project and go into it. Then run this command to create a new Node.js project:

```command
mkdir validator-demo && cd validator-demo
```

```command
npm init -y
```

To use modern JavaScript features such as `import` statements, enable ECMAScript Modules in your project by updating the `package.json` file:

```command
npm pkg set type=module
```
This command adds `"type": "module"` to your `package.json`, so you can use `import` and `export` instead of `require` and `module.exports`.

Next, install Express and `express-validator` by running:

```command
npm install express express-validator
```
With the packages installed, you're ready to build a basic version of the application.

## Creating a basic express app without validation

Let’s build a basic Express app with a user registration endpoint without input validation. This will show you what can go wrong when you don’t check the data users send.

Create a file called `index.js` and add this code:

```javascript
[label index.js]
import express from "express";
const app = express();
const PORT = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the Validation Demo!");
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
In this code, you create a basic Express server with a `/register` route that accepts user data, but it doesn’t check whether that data is valid or present. Anyone can send anything, including empty fields, invalid emails, or weak passwords, and the server will still respond with a success message.

Here’s what the code does step by step:

* Imports Express and sets up the app.
* Uses `express.json()` to parse JSON bodies in incoming requests.
* Sets up a basic `/` route that returns a welcome message.
* Creates a `/register` POST route that reads `name`, `email`, and `password` from the request body and responds with a success message—no checks at all.
* Starts the server on port 3000.

Start the server:

```command
node --watch index.js
```

```text
[output]
Server running on http://localhost:3000
```

Now, let's test the registration endpoint with a valid request using a tool like `curl` or Postman:

```command
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe", "email":"john@example.com", "password":"password123"}'
```

```text
[output]
{"message":"User registered successfully","user":{"name":"John Doe","email":"john@example.com"}}
```
If you prefer using Postman, open the app and set the request method to **POST**. Enter `http://localhost:3000/register` as the URL. Then, go to the **Body** tab, select **raw**, and choose **JSON** from the dropdown. In the text area, paste the following JSON data:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```
When you click **Send**, you’ll see a JSON response confirming the registration:

![Screenshot of Postman output](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/bdde599b-67dc-47ed-d4b4-676c9f261d00/public =3248x1998)


Now, let's try with invalid data:

```command
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"name":"", "email":"not-an-email", "password":"123"}'
```

```text
[output]
{"message":"User registered successfully","user":{"name":"","email":"not-an-email"}}
```
If you do the same in Postman, entering empty or malformed fields, you’ll get a similar response. The server still accepts the request without any complaints:

![Postman screenshot showing the error](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/805fcd1a-70ca-42c2-55f2-a22f5172c900/md2x =3248x1998)


The server accepts this clearly invalid input without any errors, which presents several significant issues:

- Missing or empty required fields are accepted without validation
- Improperly formatted email addresses aren't detected
- Short, insecure passwords are allowed
- Malicious inputs could be accepted, potentially leading to security vulnerabilities
- Your database could become polluted with invalid or inconsistent data

These limitations underscore the need for input validation with `express-validator`, which provides comprehensive validation capabilities to ensure your application receives properly formatted, secure, and consistent data.

## Getting started with express-validator

In this section, you will enhance your existing Express application by adding `express-validator`. With this middleware, your application can validate incoming request data, making your API more reliable and secure.

Let's update your registration endpoint with basic validation:

```javascript
[label index.js]
import express from "express";
[highlight]
import { body, validationResult } from "express-validator";
[/highlight]
const app = express();
const PORT = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the Validation Demo!");
});

// User registration endpoint with validation
[highlight]
app.post("/register", [
  // Validate name
  body("name").notEmpty().withMessage("Name is required"),
  
  // Validate email
  body("email").isEmail().withMessage("Invalid email address"),
  
  // Validate password
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
], (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
[/highlight]
  
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
In the highlighted code, you're importing `body` and `validationResult` from `express-validator` to define and check validation rules. 

Inside the `/register` route, `body("name").notEmpty()` ensures the `name` field isn't empty, `body("email").isEmail()` verifies the email format, and `body("password").isLength({ min: 8 })` checks that the password is at least 8 characters long. 

After the validations run, `validationResult(req)` collects any errors, and if any exist, the server responds with a `400 Bad Request` and a list of validation errors.

Upon saving the changes, Node.js will automatically restart the server. Now, try the same invalid request again:

```command
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"name":"", "email":"not-an-email", "password":"123"}'
```

You will now receive a response with validation errors:

```text
[output]
{"errors":[{"type":"field","value":"","msg":"Name is required","path":"name","location":"body"},{"type":"field","value":"not-an-email","msg":"Invalid email address","path":"email","location":"body"},{"type":"field","value":"123","msg":"Password must be at least 8 characters long","path":"password","location":"body"}]}
```

If you're using Postman, submit the same invalid data in the request body. When you click **Send**, you'll see the same list of errors returned in the response panel, showing exactly what’s wrong with each input:

![Postman screenshot showing the errors](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/e0d5caa2-ae70-443c-8062-6b560a13bc00/md2x =3248x1998)

This kind of detailed feedback helps users fix issues right away and makes your app much more reliable and secure.


## Understanding express-validator's validation chains

`express-validator` uses the concept of validation chains to create reusable, combinable validation rules. In this section, we'll explore the key components of this powerful approach.

### Basic validation chains

A validation chain starts with a field selector like `body('fieldName')` and can be followed by multiple validators and modifiers:

```javascript
body("email")
  .isEmail()               // Validator: check if it's a valid email
  .normalizeEmail()        // Sanitizer: normalize the email
  .trim()                  // Sanitizer: remove leading/trailing spaces
  .withMessage("Please provide a valid email address");  // Custom error message
```

Let's expand our registration endpoint with more sophisticated validation:

```javascript
...
[label index.js]
// User registration endpoint with improved validation
app.post("/register", [
  // Validate name
  body("name")
    .notEmpty().withMessage("Name is required")
[highlight]
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage("Name must be between 2 and 50 characters"),
[/highlight]
  
  // Validate email
  body("email")
    .notEmpty().withMessage("Email is required")
[highlight]
    .isEmail().withMessage("Invalid email format")
    .normalizeEmail(),
[/highlight]
  
  // Validate password
  body("password")
    .notEmpty().withMessage("Password is required")
[highlight]
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
[/highlight]
], (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  // Process valid data...
  const { name, email, password } = req.body;
  res.status(201).json({ 
    message: "User registered successfully", 
    user: { name, email } 
  });
});
```
The highlighted code for the `name` field uses `.trim()` to remove extra spaces and `.isLength({ min: 2, max: 50 })` to ensure the value is neither too short nor too long. 

For the `email` field, `.isEmail()` checks that the input is a valid email address, while `.normalizeEmail()` cleans it up for consistency.

 The `password` field uses `.isLength({ min: 8 })` to enforce a minimum length, helping improve security.


Now try submitting a request with a one-letter name or a poorly formatted email. For example:

```command
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"name":"J", "email":"not-an-email", "password":"password123"}'
```

```text
[output]
{"errors":[{"type":"field","value":"","msg":"Name is required","path":"name","location":"body"},{"type":"field","value":"not-an-email","msg":"Invalid email address","path":"email","location":"body"},{"type":"field","value":"123","msg":"Password must be at least 8 characters long","path":"password","location":"body"}]}
```

This response shows exactly which fields are invalid and why. It helps users correct their input immediately and ensures your app only processes clean, valid data.

### Custom validators

While express-validator comes with many built-in validators, you might need custom validation logic for specific scenarios. Let's add a custom validator to check if an email domain is allowed:

```javascript
[label index.js]
// Validate email with custom domain validation
body("email")
  .notEmpty().withMessage("Email is required")
  .isEmail().withMessage("Invalid email format")
[highlight]
  .custom(value => {
    const allowedDomains = ['example.com', 'company.org', 'business.net'];
    const domain = value.split('@')[1];
    
    if (!allowedDomains.includes(domain)) {
      throw new Error(`Email must be from one of these domains: ${allowedDomains.join(', ')}`);
    }
    
    return true;
  })
[/highlight]
  .normalizeEmail(),
```

This custom validator extracts the domain part of the email and checks if it's in the allowed list. If not, it throws an error with a helpful message.

Using `curl`, try submitting an email from a domain that isn’t allowed:

```command
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe", "email":"jane@unauthorized.com", "password":"securePass123"}'
```

You will get the following response:

```text
[output]
{"message":"User registered successfully","user":{"name":"Jane Doe","email":"jane@unauthorized.com"}}
```
If you're using Postman, submit the same request, and you’ll see a similar response. There is no error yet because the custom domain check hasn’t taken effect or is missing:


![Screenshot of postman showing an error](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/495dd127-0248-4e6c-8ce6-fc4f8f792000/md2x =3248x1998)

Once the custom validator is in place and the server is restarted, the same request will return a proper validation error instead of a success message.

## Handling validation errors gracefully

One of the most important aspects of using `express-validator` is presenting validation errors in a way that's helpful for both API consumers and end users. Let's improve our error handling to create a better user experience.

When validation fails, the default error format from `validationResult(req).array()` looks like this:

```json
{
  "errors": [
    {
      "type": "field",
      "value": "",
      "msg": "Name is required",
      "path": "name",
      "location": "body"
    },
    {
      "type": "field",
      "value": "not-an-email",
      "msg": "Invalid email format",
      "path": "email",
      "location": "body"
    }
  ]
}
```

While this contains all the necessary information, it's not the most user-friendly format, especially for frontend developers who need to display these errors next to specific form fields.

Create a `middlewares` folder in the root directory of your project to organize your custom middleware functions. Inside it, add a new file called `validationMiddleware.js` and paste the following code:

```javascript
[label middlewares/validationMiddleware.js]
import { validationResult } from "express-validator";

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    // Group errors by field name
    const formattedErrors = {};
    
    errors.array().forEach(error => {
      if (!formattedErrors[error.path]) {
        formattedErrors[error.path] = [];
      }
      
      formattedErrors[error.path].push(error.msg);
    });
    
    return res.status(400).json({ 
      success: false,
      message: "Validation failed",
      errors: formattedErrors
    });
  }
  
  next();
};
```

This middleware transforms the flat array of errors into an object where keys are field names and values are arrays of error messages for each field. Let's update our `index.js` file to use this middleware:

```javascript
[label index.js]
import express from "express";
import { body, validationResult } from "express-validator";
[highlight]
import { validate } from "./middlewares/validationMiddleware.js";
[/highlight]

const app = express();
const PORT = 3000;

app.use(express.json());

app.post("/register", [
  body("name")
    .notEmpty().withMessage("Name is required")
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage("Name must be between 2 and 50 characters"),
  
  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format")
    .normalizeEmail(),
  
  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
    .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
    .matches(/[0-9]/).withMessage("Password must contain at least one number")
[highlight]
], validate, (req, res) => {
  // If we get here, validation passed
[/highlight]
  const { name, email } = req.body;
  
  res.status(201).json({
    success: true,
    message: "Registration successful",
    user: { name, email }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

Run this test using `curl`:

```command
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"name":"", "email":"invalid-email", "password":"123"}'
```



Now when validation fails, the client receives a more structured response like this:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "name": [
      "Name is required",
      "Name must be between 2 and 50 characters"
    ],
    "email": [
      "Invalid email address",
      "Invalid email format"
    ],
    "password": [
      "Password must be at least 8 characters long"
    ]
  }
}
```

If you're using Postman, send the same request, and you’ll see the same formatted response in the output panel:

![Screenshot of the Postman output](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/d20d49f7-1631-4ba4-6cad-10627a35e300/lg1x =3248x1998)

This format makes it much easier for frontend developers to show errors next to the right form fields.


## Final thoughts
This guide covered how to use `express-validator` to keep your Express app's input clean and well-structured. You learned how to set it up, apply validation rules, create custom checks, reuse logic, and return clear, structured errors.

Strong input validation improves both security and user experience, but it should be used alongside other best practices like authentication, authorization, and proper error handling to build secure applications.

For more details and advanced features, visit the official documentation: [express-validator documentation](https://express-validator.github.io/).