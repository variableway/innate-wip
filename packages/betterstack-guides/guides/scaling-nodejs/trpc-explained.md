# From REST to tRPC: Type-Safe APIs with Node.js

[tRPC](https://trpc.io/) stands for TypeScript Remote Procedure Call. It’s a modern way to build APIs in Node.js apps that use TypeScript. Unlike REST or GraphQL, which usually needs a lot of setup and extra code, tRPC lets your front end talk to your backend directly without needing to write schemas or generate code.

With tRPC, you define your API functions (called "procedures") on the server, and the client automatically gets all the type information. This means you get autocomplete in your editor and TypeScript can catch errors before running the app. You won’t have to deal with mismatched API responses or runtime type bugs.

In this article, you’ll learn how to build a fully type-safe API for your Node.js app using tRPC.


[ad-logs]

## Prerequisites

Before you get started, make sure you have the following:

* A recent version of Node.js installed (version 18.0.0 or higher is recommended)
* A basic understanding of TypeScript (things like types, interfaces, and generics)
* Some knowledge of web development basics (like APIs and how the client and server talk to each other)

## Why use tRPC?

Traditional ways of building APIs, like REST and GraphQL, come with some built-in challenges. 

With REST, you have to manually set up routes, handle different HTTP methods, and keep separate documentation to explain how the API works. 

GraphQL solves some of those issues but also brings extra complexity, like writing schemas, creating resolvers, and learning a special query language.

tRPC takes a different approach by:

* Skipping schema files — you don’t have to write or maintain separate schema or type files
* Avoiding code generation — no need to run extra tools to keep your client and server in sync
* Using automatic type inference — TypeScript figures out the shape of your API for you
* Making validation easier — works smoothly with libraries like Zod or Yup
* Sending only what’s needed — keeps network traffic light by only sending necessary data

You still get all the essential features you’d expect in a modern API setup, like middleware, error handling, and caching. But tRPC is built with developer experience in mind and works especially well in JavaScript and TypeScript projects.

## Step 1 — Setting up a basic Express API server

In this section, you'll create the directory structure and set up a conventional Express API server. This provides a foundation to demonstrate later how tRPC transforms API development.

First, create a new directory for your project and navigate into it:

```command
mkdir trpc-api && cd trpc-api
```

Initialize a new Node.js project with npm:

```command
npm init -y
```

Now, install the necessary dependencies for a basic Express API:

```command
npm install express cors
```

```command
npm install --save-dev zod typescript tsx @types/express @types/node @types/cors
```
Let's break down these packages:

* [`express`](https://expressjs.com/) – A minimal and flexible Node.js web framework
* [`cors`](https://www.npmjs.com/package/cors) – Middleware that enables Cross-Origin Resource Sharing for the API
* [`zod`](https://zod.dev/) – A TypeScript-first library for validating and parsing input data
* [`typescript`](https://www.typescriptlang.org/) – The TypeScript compiler used to write and compile your code
* [`tsx`](https://github.com/esbuild-kit/tsx) – A fast TypeScript runtime that runs `.ts` files directly and automatically restarts on file changes during development
* [`@types` packages](https://www.npmjs.com/search?q=%40types) – Type definitions for Node.js, Express, and CORS, which enable TypeScript support for these libraries


Initialize TypeScript configuration:

```command
npx tsc --init
```

This creates a default `tsconfig.json` file. Let's update it to support ECMAScript Modules (ESM) and proper output configuration:

```json
[label tsconfig.json]
{
  "compilerOptions": {
    "target": "ES2023",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "esModuleInterop": true,
    "strict": true,
    "outDir": "dist",
    "sourceMap": true
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
```
This configuration tells TypeScript to target modern JavaScript (ES2023), use Node.js-style module resolution, and enable strict type checking to improve type safety. It also sets the output directory for compiled files to `dist` and generates source maps to help with debugging.

Update your `package.json` file to include the necessary scripts and set the project to use ESM:

```json
[label package.json]
{
  "name": "trpc-api",
  "version": "1.0.0",
  "description": "A tRPC API example",
[highlight]
  "main": "dist/index.js",
  "type": "module",
[/highlight]
  "scripts": {
[highlight]
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
[/highlight]
  }
...
}
```
In the highlighted code, you set the project to use ECMAScript Modules with `"type": "module"` and add scripts for development, building, and running the app. The `dev` script uses `ts-node-dev` for live reloading, `build` compiles the TypeScript code, and `start` runs the compiled app from the `dist` folder.


Create the basic directory structure for your project:

```command
mkdir -p src
```

Now, let's create a simple Express API with a single endpoint for user creation. This endpoint will demonstrate input validation and error handling principles that we'll later enhance with tRPC.

Create an `index.ts` file in the `src` directory:

```typescript
[label src/index.ts]
import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import cors from 'cors';
import { z } from 'zod';

// Mock database - in a real app, you'd use a real database
let users = [
  { id: '1', name: 'Alice', email: 'alice@example.com' },
  { id: '2', name: 'Bob', email: 'bob@example.com' },
];

// Define validation schema with Zod
const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z.string().email('Invalid email format'),
});

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Validation middleware using Zod
const validateRequest = (schema: z.ZodType<any, any>): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: 'Validation failed',
          details: error.errors.map(e => ({
            path: e.path.join('.'),
            message: e.message
          }))
        });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  };
};

// POST - Create a new user
app.post('/api/users', validateRequest(userSchema), (req, res) => {
  const { name, email } = req.body;
  
  // Check for duplicate email
  if (users.some(user => user.email === email)) {
    res.status(409).json({ 
      error: 'A user with this email already exists'
    });
    return;
  }
  
  // Create new user
  const newUser = {
    id: String(users.length + 1), // Simple ID generation
    name,
    email
  };
  
  // Save to our mock database
  users.push(newUser);
  
  // Return the newly created user with 201 Created status
  res.status(201).json(newUser);
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

This `index.ts` file sets up a basic Express server with a simple POST endpoint to create new users, using Zod for input validation. Here's a quick breakdown:

* It imports the required libraries: Express for the server, CORS for cross-origin requests, and Zod for validating request data.
* A mock in-memory database holds user data.
* A Zod schema (`userSchema`) defines rules for valid user input: names must be at least 2 characters, and emails must be in a valid format.
* A custom middleware function `validateRequest` uses this schema to validate incoming request bodies before they reach the route handler.
* The `/api/users` route handles POST requests to add new users, checks for duplicate emails, and returns the new user if successful.
* The app listens on port 3000 and logs the server URL on startup.

Run your server using:

```command
npm run dev
```

You should see output similar to:

```text
[output]
> trpc-api@1.0.0 dev
> tsx src/index.ts

Server running on http://localhost:3000
```

You can test the API using `curl`, or with a tool like [Postman](https://www.postman.com/) if you prefer a visual interface:

```command
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Charlie","email":"charlie@example.com"}'
```

If the request is successful, you should get a response like this:


```json
[output]
{
  "id": "3",
  "name": "Charlie",
  "email": "charlie@example.com"
}
```

If you're using Postman, set the method to **POST**, the URL to `http://localhost:3000/api/users`, and include the same JSON body. 

![a screenshot showing the postman set](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/3d789c60-f260-44ff-f735-55ed37cd1300/public =3248x1996)

Let's also try with invalid inputs to see the validation in action:

```command
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"C","email":"not-an-email"}'
```

The response shows Zod's structured validation errors:

```text
[output]
{
  "error": "Validation failed",
  "details": [
    { "path": "name", "message": "Name must be at least 2 characters long" },
    { "path": "email", "message": "Invalid email format" }
  ]
}
```
If you're using Postman, you can test the same invalid input by keeping the method as **POST**, and using the same endpoint and body. Here's what the validation error looks like in Postman:

![Postman validation error example](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/6a4b1c92-4fe7-48b2-8c19-049bdeaa4400/md2x =3248x1996)

Now you have a working Express API with proper validation, but there are still a few limitations:

* You need to manually define TypeScript interfaces to reuse types outside of Zod validation.
* Your client doesn't automatically know the API's input and output types, so you have to maintain separate documentation or types.
* You still need to set up routes, HTTP methods, and handle requests and responses by hand.
* There's no built-in way to generate API documentation.

In the next step, you'll see how tRPC can help solve these issues with end-to-end type safety and a smoother development experience.


## Step 2 — Transforming to a tRPC API

Now that you have a conventional Express API, let's transform it using tRPC to demonstrate how it addresses the limitations of traditional REST APIs. We'll implement the same user creation functionality but with tRPC's end-to-end type safety.

Let's examine how tRPC fundamentally changes API development. This diagram shows the streamlined communication between client and server components. 

Unlike REST APIs with multiple endpoints, tRPC uses a single channel while automatically sharing types between server and client without code generation or schema duplication.

![tRPC Architecture Overview: A diagram showing the client-server interaction in a tRPC application, with type information flowing from server to client and HTTP requests/responses exchanged through a single endpoint.](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/ba219e20-7065-4b1d-814f-fa7ee048c500/orig =2028x1288)

The client makes fully type-safe procedure calls through one HTTP endpoint, with complete IDE support. The server focuses on business logic rather than HTTP concerns, while type information flows automatically between them.

First, install the necessary tRPC dependencies:

```command
npm install @trpc/server @trpc/client
```

Let's break down these new packages:

- `@trpc/server` – The core server-side library for creating tRPC procedures and routers
- `@trpc/client` – The client library for consuming tRPC APIs with full type safety

Now, update your `src/index.ts` file to use tRPC instead of the Express route:

```typescript
[label src/index.ts]
import express from 'express';
import cors from 'cors';
[highlight]
import { initTRPC, TRPCError } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
[/highlight]
import { z } from 'zod';

// Mock database - same as before
let users = [
  { id: '1', name: 'Alice', email: 'alice@example.com' },
  { id: '2', name: 'Bob', email: 'bob@example.com' },
];

[highlight]
// 1. Initialize tRPC
const t = initTRPC.create();
[/highlight]

const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z.string().email('Invalid email format'),
});

[highlight]
// Create a tRPC router with our procedure
const appRouter = t.router({
  createUser: t.procedure
    .input(userSchema)
    .mutation(({ input }) => {
      // Check for duplicate email
      const existingUser = users.find(user => user.email === input.email);
      if (existingUser) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'A user with this email already exists',
        });
      }
      
      // Create new user
      const newUser = {
        id: String(users.length + 1),
        name: input.name,
        email: input.email,
      };
      
      // Save to mock database
      users.push(newUser);
      
      // Return the newly created user
      return newUser;
    }),
});

// 4. Export type definition of API
export type AppRouter = typeof appRouter;
[/highlight]

// Create Express app
const app = express();

// Middleware
app.use(cors());

[highlight]
//  Add tRPC middleware to Express
app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: () => ({})
  })
);

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
[/highlight]
```
Compared to the earlier Express version, this tRPC setup is much cleaner and more focused on developer experience. 


Instead of defining individual routes and HTTP methods, you define procedures like `createUser` that describe what your app can do. Validation is built into the procedure using Zod, so you don’t need a separate middleware for it — just pass the schema to `.input()` and tRPC handles the rest.

Error handling also gets easier. Rather than manually setting status codes and crafting responses, you can throw a `TRPCError` and tRPC will handle it consistently. 

On top of that, type safety is fully automatic. By exporting `AppRouter`, clients can import the types of all your procedures without writing a single extra interface or type. And instead of having a bunch of different route URLs, all your procedures are available through one endpoint: `/trpc`.

With tRPC, the server implementation is more concise and contains fewer manual steps. Validation, error handling, and HTTP concerns are abstracted away, allowing you to focus on your business logic.

Now, let's create a simple client to test our tRPC API. Create a new file called `client.ts` in the `src` directory:

```typescript
[label src/client.ts]
import { createTRPCClient } from '@trpc/client';
import { httpBatchLink } from '@trpc/client';
import type { AppRouter } from './index.js';

// Create a tRPC client (using the newer non-deprecated approach)
const client = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/trpc',
    }),
  ],
});

async function main() {
  try {
    // Create a new user
    console.log('Creating a new user:');
    const newUser = await client.createUser.mutate({
      name: 'Charlie',
      email: 'charlie@example.com',
    });
    console.log('User created:', newUser);
    
    // Try creating a user with the same email (should fail)
    console.log('\nTrying to create a user with the same email:');
    try {
      await client.createUser.mutate({
        name: 'Charlie2',
        email: 'charlie@example.com', // Same email as before
      });
    } catch (error: any) { // Type the error as any to access the message property
      console.error('Error:', error.message);
    }
    
    // Try with invalid data (should fail validation)
    console.log('\nTrying with invalid data:');
    try {
      await client.createUser.mutate({
        name: 'D', // Too short
        email: 'not-an-email',
      });
    } catch (error: any) { // Type the error as any to access the message property
      console.error('Validation error:', error.message);
    }
  } catch (error: any) { // Type the error as any to access the message property
    console.error('Unexpected error:', error.message);
  }
}

main();
```
What’s great about this client code is how effortless it is to work with. The call to `client.createUser.mutate()` is fully type-safe. TypeScript knows exactly what input the procedure expects, what it returns, and even gives you autocomplete as you type.

You don’t need to define or sync any types between server and client — it all works because both sides share the same `AppRouter` type.

Even error handling feels smooth. If the server throws an error or the input fails validation, the client receives that information directly, including detailed Zod errors. No need to wire up custom error formats or status codes.

Restart the server again:

```command
npm run dev
```

Now open a new terminal and run the client like this:

```command
npx tsx src/client.ts
```

You should see output similar to:

```text
[output]
Creating a new user:
User created: { id: '3', name: 'Charlie', email: 'charlie@example.com' }

Trying to create a user with the same email:
Error: A user with this email already exists

Trying with invalid data:
Validation error: [
  {
    "code": "too_small",
    "minimum": 2,
    "type": "string",
    "inclusive": true,
    "exact": false,
    "message": "Name must be at least 2 characters long",
    "path": [
      "name"
    ]
  },
  {
    "validation": "email",
    "code": "invalid_string",
    "message": "Invalid email format",
    "path": [
      "email"
    ]
  }
]
```


What stands out most here is the type safety. The client doesn’t just “guess” what the server expects — it knows. That’s the real power of tRPC: no extra type definitions, no code generation, just shared types and a smooth dev experience.


## Step 3 — Implementing a modular tRPC structure

Now let's reorganize our tRPC implementation by separating concerns and creating a more maintainable structure. This approach follows best practices for larger applications by placing tRPC-related code in dedicated files.

![tRPC Implementation Flow: A step-by-step visualization of how to build a tRPC API, from defining schemas through creating procedures, adding them to a router, exporting types, and creating a type-safe client.](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/27625874-0a5b-462c-2a98-42578930b800/orig =1936x1356)

First, let's create a directory structure for our tRPC code:

```command
mkdir -p src/trpc
```


Now, let's create a dedicated router file that will contain our tRPC procedure definitions:

```typescript
[label src/trpc/router.ts]
import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';

// Mock database
let users = [
  { id: '1', name: 'Alice', email: 'alice@example.com' },
  { id: '2', name: 'Bob', email: 'bob@example.com' },
];

// Initialize tRPC
const t = initTRPC.create();

// Define input validation schema with Zod
const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z.string().email('Invalid email format'),
});

// Create a tRPC router with our procedure
export const appRouter = t.router({
  createUser: t.procedure
    .input(userSchema)
    .mutation(({ input }) => {
      console.log('Creating user with input:', input);
      
      // Check for duplicate email
      const existingUser = users.find(user => user.email === input.email);
      if (existingUser) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'A user with this email already exists',
        });
      }
      
      // Create new user
      const newUser = {
        id: String(users.length + 1),
        name: input.name,
        email: input.email,
      };
      
      // Save to mock database
      users.push(newUser);
      
      // Return the newly created user
      return newUser;
    }),
});

// Export type definition of API
export type AppRouter = typeof appRouter;
```


Now, let's update our main server file to use the modular router:

```typescript
[label src/index.ts]
import express from 'express';
import cors from 'cors';
[highlight]
import * as trpcExpress from '@trpc/server/adapters/express';
import { appRouter } from './trpc/router.js';
[/highlight]

// remove all the code until the create express app line
// Create Express app
const app = express();

// Middleware
app.use(cors());
[highlight]
app.use(express.json());
// Add a test route to make sure Express is working
app.get('/', (req, res) => {
  res.send('Server is running! tRPC endpoint available at /trpc');
});
[/highlight]

// Add tRPC middleware to Express
app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: () => ({}),
[highlight]
    onError: ({ error }) => {
      console.error('tRPC error:', error);
    },
[/highlight]
  })
);

// Start server
const PORT = 3000;
app.listen(PORT, () => {
[highlight]
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`tRPC API endpoint available at http://localhost:${PORT}/trpc`);
[/highlight]
});
```
In the highlighted code, you make a few key updates to support a modular tRPC setup within your Express server:

* Import `createExpressMiddleware` from `@trpc/server/adapters/express` and the `appRouter` from your modular router file. This sets the foundation for tRPC integration.
* Add a basic test route (`/`) that returns a simple message. This helps confirm the server is running and makes it easier to verify Express is working before testing the tRPC endpoint.
* Use `express.json()` middleware to enable JSON parsing for incoming requests, which is required for tRPC to process request bodies.
* Attach the tRPC middleware to the `/trpc` path and pass in your `appRouter`. You also define a basic `createContext` function and use the `onError` hook to log any errors that occur in your tRPC procedures.
* Finally, when starting the server, you print both the root server URL and the tRPC endpoint to the console so it's clear where the API is accessible.


Since you've moved the AppRouter type to a new location, you need to update your client file:

```typescript
[label src/client.ts]
import { createTRPCClient } from '@trpc/client';
import { httpBatchLink } from '@trpc/client';
[highlight]
import type { AppRouter } from './trpc/router.js';
[/highlight]

// Create a tRPC client
const client = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/trpc',
    }),
  ],
});

async function main() {
...
}

main();
```

This modular setup makes your project easier to work with in several ways.

 First, keeping your router logic separate from the main server file helps keep things clean and focused — each file does one job, which makes the code easier to read and update. 

As your API grows, you can split procedures into different files and combine them into a single router without cluttering the server setup. 

It also makes testing and making changes less of a headache since your business logic isn’t buried inside the HTTP layer. Overall, this structure just makes the project more maintainable and approachable, especially when other developers are jumping in.

Try running the server and client with this new structure:

```command
npm run dev
```

And in another terminal:

```command
npx tsx src/client.ts
```
```text
[output]
Creating a new user:
User created: { id: '3', name: 'Charlie', email: 'charlie@example.com' }

Trying to create a user with the same email:
Error: A user with this email already exists

Trying with invalid data:
Validation error: [
  {
    "code": "too_small",
    "minimum": 2,
    "type": "string",
    "inclusive": true,
    "exact": false,
    "message": "Name must be at least 2 characters long",
    "path": [
      "name"
    ]
  },
  {
    "validation": "email",
    "code": "invalid_string",
    "message": "Invalid email format",
    "path": [
      "email"
    ]
  }
]
```
This modular approach is a best practice for larger tRPC applications, making the codebase more maintainable as it grows.


## Step 4 — Expanding Your tRPC API with Query Procedures

Now that you have a modular tRPC structure in place, let's see how easy it is to expand our API by adding query procedures. In REST, this would require setting up new routes, but with tRPC, it's as simple as adding new procedures to your router.

Let's update our router file to include two new procedures:

1. Getting a list of all users
2. Getting a single user by ID

```typescript
[label src/trpc/router.ts]
import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';

// Mock database
let users = [
  { id: '1', name: 'Alice', email: 'alice@example.com' },
  { id: '2', name: 'Bob', email: 'bob@example.com' },
];

// Initialize tRPC
const t = initTRPC.create();

// Define input validation schemas with Zod
const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z.string().email('Invalid email format'),
});

[highlight]
// Define a schema for user ID
const userIdSchema = z.object({
  id: z.string(),
});
[/highlight]

export const appRouter = t.router({
  // Create a new user
  createUser: t.procedure
    .input(userSchema)
    ....
    }),

  [highlight]
  // Get all users
  getUsers: t.procedure
    .query(() => {
      console.log('Getting all users');
      return users;
    }),
  
  // Get a single user by ID
  getUserById: t.procedure
    .input(userIdSchema)
    .query(({ input }) => {
      console.log(`Getting user with ID: ${input.id}`);
      
      const user = users.find(user => user.id === input.id);
      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `User with ID ${input.id} not found`,
        });
      }
      
      return user;
    }),
  [/highlight]
});

// Export type definition of API
export type AppRouter = typeof appRouter;
```
In this code, you add two new read-only procedures to your tRPC router to make your API more useful.

First, you define a simple `userIdSchema` using Zod to validate that the input for `getUserById` contains a string `id`. This ensures that when someone tries to fetch a specific user, the input is type-safe and properly structured.

Then, you add two new procedures to the router:

* `getUsers` is a query that returns the full list of users. It doesn’t take any input and just returns the `users` array. This is useful for listing all users in the system.

* `getUserById` accepts an `id` as input, looks for a user with that ID, and returns the user if found. If no match is found, it throws a `TRPCError` with a `NOT_FOUND` code and a helpful error message. This way, error handling stays consistent and clear on the client side.

Together, these additions make your API more flexible and realistic, showing how easy it is to scale a tRPC router with more procedures.

Now let's update our client code to test these new procedures:

```typescript
[label src/client.ts]
import { createTRPCClient } from '@trpc/client';
import { httpBatchLink } from '@trpc/client';
import type { AppRouter } from './trpc/router.js';

// Create a tRPC client
const client = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/trpc',
    }),
  ],
});

async function main() {
[highlight]
    try {
    // Get all users
    console.log('Getting all users:');
    const allUsers = await client.getUsers.query();
    console.log('Users:', allUsers);
    
    // Get a specific user
    console.log('\nGetting user with ID 1:');
    const user1 = await client.getUserById.query({ id: '1' });
    console.log('User:', user1);
    
    // Try creating a new user
    console.log('\nCreating a new user:');
    const newUser = await client.createUser.mutate({
      name: 'Charlie',
      email: 'charlie@example.com',
    });
    console.log('User created:', newUser);
    
  } catch (error) {
    console.error('Error occurred:');
    console.error(error);
  }
[/highlight]
}

main();
```
In this updated client, you’re testing the full flow of your tRPC API with the new procedures. First, it fetches and logs all users using `getUsers`, which confirms that the server is returning data correctly. 

Then, it retrieves a specific user by ID using `getUserById`, verifying that input validation and lookup are working as expected. After that, it creates a new user with `createUser`, showing that the mutation runs successfully and returns the newly added user.

The entire interaction is fully type-safe from end to end. TypeScript ensures you pass the correct input to each procedure and gives you autocomplete and error checking as you write. Any errors that occur—whether from validation, duplicate data, or missing users—can be caught and handled just like normal exceptions, making your development experience smoother and more predictable.


Run your server and client to test these operations:

```command
npm run dev
```

And in another terminal:

```command
npx tsx src/client.ts
```

You should see output showing each operation being performed successfully:

```text
[output]
Getting all users:
Users: [
  { id: '1', name: 'Alice', email: 'alice@example.com' },
  { id: '2', name: 'Bob', email: 'bob@example.com' }
]

Getting user with ID 1:
User: { id: '1', name: 'Alice', email: 'alice@example.com' }

Creating a new user:
User created: { id: '3', name: 'Charlie', email: 'charlie@example.com' }
```

What’s nice about this is how smooth it is to add and use new functionality with tRPC. Compared to a traditional REST API, there’s a lot less overhead and boilerplate. Here’s why:

* No route configuration — you don’t have to define paths, HTTP methods, or manually wire up parameter parsing. Just add a new procedure.
* Type safety is built in — Zod handles input validation, and TypeScript enforces the correct types on both the client and server.
* Error handling is consistent — when a user isn’t found, you throw a `TRPCError`, and tRPC takes care of the response formatting and status code.
* The client updates automatically — once a procedure is added to the router, the client can call it with full type support and autocomplete, without writing extra code or generating types.

This is what makes tRPC such a powerful tool for TypeScript projects. You focus on writing your logic; everything else—validation, typing, error handling, and client integration—comes along automatically.

## Final thoughts

tRPC makes building APIs in TypeScript fast, type-safe, and boilerplate-free. Instead of juggling route configs and manual types, you focus on your logic—and the types just work, end to end.

What you’ve built here is a solid foundation. To go further, consider adding update/delete operations, authentication, or connecting to a real database.

Check out the [tRPC documentation](https://trpc.io/docs) for more features and best practices.

