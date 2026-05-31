# Express.js vs Fastify: An In-Depth Framework Comparison

For years, [Express](https://expressjs.com/) has been the go-to framework for Node.js, valued for its simplicity, flexibility, and vast ecosystem. It remains widely used, but its development slowed down long ago as applications grew in complexity, and its architecture has remained largely unchanged.  

[Fastify](https://fastify.dev/) offers a different approach, focusing on efficiency, built-in validation, and structured plugins while keeping a familiar developer experience. If you’re comfortable with Express, Fastify might feel like a natural extension, providing optimizations that reduce overhead and improve performance.  

<iframe width="100%" height="315" src="https://www.youtube.com/embed/7gTj5RLyMXw?si=0HL874pVCHzEoKZE" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

The question isn’t about replacing Express but whether Fastify better suits your needs. 

If you're facing performance bottlenecks or scaling challenges or want more structured validation, it’s worth exploring. Let’s break down the differences to help you decide.


## What is Fastify?


Fastify is a web framework for Node.js that focuses on **efficiency and low overhead**. Like Express, it provides routing, middleware support, and request handling, but with some differences in approach. 

It uses an event-driven architecture and schema-based validation, which can help optimize performance, especially for API-heavy applications.  

You may find Fastify’s built-in validation and plugin system useful if you work with JSON-based APIs or microservices. It supports both callback-based and async/await syntax, making it adaptable to different coding styles. 


## Fastify vs. Express: a quick comparison

Picking the right framework affects speed, maintainability, and developer experience.

Express is a longtime favorite for its simplicity, while Fastify is a faster, more efficient alternative. Here’s a quick overview of how they compare:

| Feature                 | Fastify  | Express  |
|-----------------------------|--------------|--------------|
| Routing                   | Function-based routes, returns directly without `reply.send()` | Middleware-driven approach, requires `res.send()` |
| Route prefixing           | Supports automatic prefixing with `register()` | Requires manual prefixing, lacks built-in support |
| Performance               | Handles ~46,243 requests/sec with low latency (~20ms) | Handles ~10,252 requests/sec with higher latency (~90ms) |
| Hooks                     | Provides onRequest, preHandler, onSend | Relies on middleware for request lifecycle control |
| Plugin system             | Native plugin system with encapsulation and modularity | Requires manual scoping and structuring |
| Error handling            | Automatic handling for sync & async errors | Requires explicit `next(err)`, Express 5 improves async handling |
| Input validation          | Uses AJV for schema-based validation | Requires third-party libraries like joi or express-validator |
| Logging                   | Integrates Pino for fast, structured logging | Requires third-party libraries like Morgan, Winston, or Pino |
| TypeScript support        | Native TypeScript support with strong generics | Relies on `@types/express` and manual setup |
| Built-in HTTP/2 support   | Supports HTTP/2 out of the box | Requires `spdy` or other third-party modules |
| Automatic HTTP/1 fallback | Uses ALPN negotiation | Depends on the library used |
| Ease of setup             | Simple, works out of the box | Requires extra configuration |
| Secure & plaintext support | Supports both HTTP/2 over TLS and plaintext | Secure only (depends on `spdy`) |

## Routing

While both Express and Fastify are designed for handling HTTP requests, their routing syntax and structure differ significantly.

Express follows a middleware-driven approach, where routes are attached directly to the `app` instance. Routes must explicitly call `res.send()` or `res.json()` to send responses.  

```javascript
import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send({ message: "Hello from Express!" });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
```
You must explicitly call `res.send()` or `res.json()` to return responses.
 
Express does not provide built-in support for route prefixes. Instead, you must manually structure their routers:  

```javascript
const userRouter = express.Router();

userRouter.get("/v1/user", (req, res) => res.send("User API v1"));
userRouter.get("/v2/user", (req, res) => res.send("User API v2"));

app.use("/", userRouter);
```
Each route must be manually prefixed, making API versioning less efficient.


Fastify follows a function-based approach where routes can directly return values, eliminating the need for `reply.send()`.  

```javascript
import Fastify from "fastify";

const fastify = Fastify();

fastify.get("/", async (request, reply) => {
  return { message: "Hello from Fastify!" };
});

fastify.listen(3000, () => console.log("Server running on http://localhost:3000"));
```
No need for `reply.send()`—Fastify automatically serializes the return value.

Unlike Express, Fastify automatically applies prefixes using `register()`:  

```javascript
import Fastify from "fastify";

const fastify = Fastify();

fastify.register(async (instance) => {
  instance.get("/user", async () => "User API v1");
}, { prefix: "/v1" });

fastify.register(async (instance) => {
  instance.get("/user", async () => "User API v2");
}, { prefix: "/v2" });

fastify.listen(3000);
```
Fastify handles prefixing at compilation time, improving performance and maintainability. 

Fastify also allows applying a global prefix without modifying each route:  

```javascript
const fastify = require("fastify")();

fastify.register(async (app) => {
  app.get("/users", async () => "User List");
}, { prefix: "/api/v1" });

fastify.listen(3000);
```
With that, let's look at how their performance.

## Performance

I ran benchmark tests on my machine using a simple "Hello World" application to compare the performance of Express and Fastify under the same conditions.

Express, while highly versatile and widely used, handled around **20,309 requests per second** in my tests. While still a solid choice, its performance overhead can become a bottleneck for high-traffic applications. 

On the other hand, Fastify, designed for speed and efficiency, significantly outperformed Express, processing around **114,195 requests per second**—over **5.6× faster** in this scenario.

These results align with Fastify's own [benchmark tests](https://github.com/fastify/benchmarks/), which consistently show Fastify outperforming Express in similar "Hello World" scenarios.

If your application demands high throughput, Fastify is the better choice.


## Hooks
Lifecycle hooks in web frameworks provide a structured way to intercept and manage different stages of request processing.

Express lacks distinct lifecycle hooks but uses middleware functions to achieve lifecycle control. Middleware can process requests globally or for specific routes.


```javascript
...
app.use((req, res, next) => {
  if (!req.headers['x-auth-token']) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});

app.get('/data', (req, res) => res.json({ message: 'Protected content' }));
...
```

Fastify, on the other hand, provides dedicated lifecycle hooks for fine-grained control over request/response handling. Hooks can be scoped globally to plugins or individual routes, ensuring modular and predictable behavior. Key hooks include:

- `onRequest`: Executed when the request is received.
- `preHandler`: Runs before the route handler for tasks like authentication.
- `onSend`: Modifies the response after serialization.
- `onResponse`: Executes after the response is sent (e.g., logging).

Below is an example of a `preHandler` hook that checks for an authentication token before processing a request:

```javascript
...
fastify.addHook('preHandler', async (request, reply) => {
  if (!request.headers['x-auth-token']) {
    reply.code(401).send({ error: 'Unauthorized' });
  }
});

fastify.get('/data', async () => ({ message: 'Protected content' }));

fastify.listen(3000);
....
```

As you can see, while Express middleware achieves the same goal, it’s not as clear in terms of what's happening compared to Fastify’s hook system. 

Fastify's lifecycle hooks provide a more structured and intuitive way to manage request processing, making the flow easier to understand and optimize.

## Plugin system

A plugin system allows applications to be built in a modular way, where features can be encapsulated, reused, and extended without modifying the core application logic.

Express does not have a built-in plugin system. Instead, you typically use middleware functions or external modules to extend functionality. 

However, since everything is attached directly to the main app instance, there’s no built-in encapsulation, which can lead to conflicts in larger applications.

Here’s how an Express-based "plugin" (really just a function that modifies the `app`) might look:


```javascript
[label userPlugin.js]
export function userPlugin(app) {
  const userService = {
    getUser: (id) => ({ id, name: `User ${id}` }),
  };

  app.get('/user/:id', (req, res) => {
    const user = userService.getUser(req.params.id);
    res.json(user);
  });
}
```
In this example, the `userPlugin` function registers a user-related route and provides a simple user service. However, since Express lacks a built-in plugin system, **all routes and services are attached directly to the `app` instance**, making it harder to isolate them in larger applications.

Now, here’s how the main Express file integrates the plugin:  

```javascript
[label main.js]
import express from 'express';
import { userPlugin } from './userPlugin.js';

const app = express();

userPlugin(app);

app.get('/hello', (req, res) => {
  res.json({ message: 'Hello from another route!' });
});

app.listen(3000, () => {
  console.log('Express server running at http://localhost:3000');
});
```


In contrast, Fastify’s plugin system makes building modular, reusable, and well-encapsulated components easy. Plugins can register routes, extend functionality, or inject shared services. 

The `register` API ensures everything stays neatly scoped, preventing conflicts and making scaling easy for monolithic and microservice architectures.


Here’s an example of a Fastify plugin that provides a simple user service:

```javascript
[label userPlugin.js]
export default async function userPlugin(fastify, options) {
  fastify.decorate('userService', {
    getUser: (id) => ({ id, name: `User ${id}` }),
  });

  fastify.get('/user/:id', async (request, reply) => {
    const user = fastify.userService.getUser(request.params.id);
    reply.send(user);
  });
}
```
Now, register this plugin in the main Fastify instance:

```javascript
[label main.js]
import Fastify from 'fastify';
import userPlugin from './userPlugin.js';

const fastify = Fastify();

await fastify.register(userPlugin);

fastify.register(async (instance) => {
  instance.get('/hello', async () => ({ message: 'Hello from another plugin!' }));
});

fastify.listen({ port: 3000 }, () => {
  console.log('Fastify server running at http://localhost:3000');
});
```

Fastify’s approach makes scaling and maintaining complex applications easier while keeping modules self-contained.

## Error handling

Error handling is crucial to any framework, ensuring that unexpected failures don’t crash the application and that meaningful responses are sent to clients. 


Express relies on error-handling middleware, requiring errors to be explicitly passed using `next(error)`.

In Express 4 or earlier, errors in asynchronous middleware must be manually caught and forwarded to the error handler using `next(error)`, or they will go unhandled.


```javascript
...
app.use(async (req, res, next) => {
  try {
    req.user = await getUser(req);
    next();
  } catch (error) {
    next(error); // Explicitly pass errors
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ error: err.message });
});
```
If you forget to call `next(error)`, the error won’t be handled properly.

Express 5 improves error handling by automatically forwarding async errors to the error handler—just like Fastify:


```javascript
app.use(async (req, res, next) => {
  req.user = await getUser(req); // Automatically caught if rejected
  next(); // No need for explicit error handling
});

app.use((err, req, res, next) => {
  res.status(500).send({ error: err.message });
});
```

Fastify simplifies error handling with built-in mechanisms that automatically catch both synchronous and asynchronous errors. Unlike Express, Fastify provides scoped error handlers via `setErrorHandler`, allowing custom error handling at both the global and plugin levels:

- **Automatic error handling**: Errors in routes or lifecycle hooks are automatically caught and passed to the error handler

- **Scoped handlers**: Use `setErrorHandler` to define custom error handlers at the global or plugin level


Here’s how Fastify handles errors:

```javascript
import Fastify from "fastify";

const fastify = Fastify({ logger: true });

fastify.setErrorHandler((error, request, reply) => {
  reply.status(500).send({ error: error.message });
});

fastify.get("/", async () => {
  throw new Error("Something went wrong!");
});

fastify.listen(3000);
```

Unlike Express, Fastify’s automatic error propagation ensures that errors are always handled, reducing the chance of uncaught exceptions. Additionally, scoped error handlers allow modular error management, making debugging and scaling much easier.

## Input validation
Input validation ensures that incoming data meets the expected format, reducing errors and security risks.

Express lacks built-in validation and requires external libraries like [`Joi`](https://www.npmjs.com/package/joi), [`express-validator`](https://www.npmjs.com/package/express-validator), or [`Yup`](https://www.npmjs.com/package/yup) to implement validation logic. 

While this approach is flexible, it introduces additional dependencies, increases boilerplate code, and may require manual handling of validation errors.

Here’s an example of input validation in Express using `Joi`:

```javascript
import express from 'express';
import Joi from 'joi';

const app = express();
app.use(express.json());

const userSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  age: Joi.number().min(18).optional(),
});

app.post('/user', (req, res) => {
  const { error, value } = userSchema.validate(req.body);
  ...
});
...
```

Fastify takes a schema-based approach to validation, which is highly efficient and tightly integrated into the framework. By default, it uses [Ajv](https://www.npmjs.com/package/ajv)for request validation and [fast-json-stringify](https://www.npmjs.com/package/fast-json-stringify) for response serialization.

This eliminates the need for external libraries while supporting schemas reuse across routes through the `addSchema` API. Fastify also supports advanced features like custom validators, shared schema definitions, and error handling.

```javascript
...
fastify.addSchema({
  $id: 'userSchema',
  type: 'object',
  required: ['name', 'email'],
  properties: {
    name: { type: 'string' },
    email: { type: 'string', format: 'email' },
    age: { type: 'number', minimum: 18 },
  },
});

fastify.post('/user', {
  schema: {
    body: { $ref: 'userSchema#' },
  },
}, (request, reply) => {
  reply.send({ message: 'Validation passed!', data: request.body });
});
...
```

Unlike Express, Fastify's schema-based validation is built-in, reducing boilerplate and improving performance by leveraging compiled schemas for faster execution.

Fastify’s tight integration with JSON Schema and built-in validation engine makes it the better choice for applications that require structured, high-performance validation. 

Express offers greater flexibility but at the cost of extra dependencies and manual error handling.

## Logging
Logging is essential in any application, helping developers monitor requests, debug issues, and maintain observability.

Express does not provide built-in logging and depends on third-party libraries like [Morgan](https://betterstack.com/community/guides/logging/morgan-logging-nodejs/) for request logging and [Winston](https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-winston-and-morgan-to-log-node-js-applications/) or [Pino](https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-pino-to-log-node-js-applications/) for general-purpose logging.


Here’s an example of using Winston for logging in an Express application:

```javascript
import express from "express";
import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/app.log" }),
  ],
});

const app = express();
app.use((req, res, next) => {
  logger.info(`Request: ${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => res.send("Hello, Express with Winston!"));
app.listen(3000);
```

Since Express lacks a built-in logging system, you must manually configure and manage logging libraries, increasing setup time and maintenance.

Fastify, on the other hand, integrates with Pino by default, enabling structured, high-performance logging with minimal setup.

Logging is disabled by default but can be activated using `{ logger: true }`.

- Optimized JSON logging for production environments
- Formatted logs in development mode
- Automatic request ID tracking for better traceability
- Custom log serializers to redact sensitive information

Here’s an example of Fastify’s built-in logging:

```javascript
import Fastify from "fastify";

const fastify = Fastify({ logger: true });

fastify.get("/", (req, reply) => {
  req.log.info("Request received"); // Log request information
  reply.send({ message: "Hello, Fastify!" });
});

fastify.listen(3000, () => {
  console.log("Fastify server running on http://localhost:3000");
});
```


Fastify’s native Pino integration provides a structured, high-performance logging solution with minimal configuration, making it ideal for production-ready applications


## TypeScript support

TypeScript provides type safety, better developer experience, and improved maintainability in large applications. 

Express does not provide native TypeScript support and relies on the community-maintained [`@types/express`](https://www.npmjs.com/package/@types/express) package for type definitions. 

You must manually apply typings for requests, responses, and middleware, which increases boilerplate code and makes type enforcement less seamless.

Here’s an example of defining custom request typings in Express:

```typescript
import express, { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

interface UserRequest extends Request {
  query: {
    username: string;
    email?: string;
  };
}

app.get("/", (req: UserRequest, res: Response) => {
  const { username, email } = req.query;
  res
    .status(200)
    .send(`Hello, ${username}! ${email ? `Your email is ${email}.` : ""}`);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```


Conversely, Fastify has native TypeScript support built into its core. It provides better type inference, generics-based route validation, and automatic type safety across handlers, plugins, and lifecycle hooks.

For instance, Fastify allows defining a route with strict type-checking for query parameters:

```typescript
server.get<{ Querystring: { username: string } }>("/login", async (request) => {
  const { username } = request.query;
  // `username` is strongly typed as a string
});
```

Fastify also integrates seamlessly with JSON Schema-based validation and serialization. Using tools like [TypeBox](https://fastify.dev/docs/latest/Reference/Type-Providers/#typebox), you can define schemas and enforce types simultaneously:

```typescript
const UserSchema = Type.Object({ name: Type.String() });
server.post<{ Body: Static<typeof UserSchema> }>(
  "/",
  { schema: { body: UserSchema } },
  (request) => {
    const { name } = request.body;
    // `name` is automatically inferred as a string
  }
);
```

Fastify allows type-safe extensions using declaration merging, ensuring smooth plugin integration:

```typescript
declare module "fastify" {
  interface FastifyRequest {
    user: { id: number };
  }
}

server.decorateRequest("user", null);
```
Lifecycle hooks, such as `preValidation` and `preHandler`, are fully typed and context-aware, giving precise control over request handling.

For example, validating an `Authorization` header is straightforward:

```typescript
server.addHook<{ Headers: { Authorization: string } }>(
  "preValidation",
  (req, reply) => {
    if (!req.headers.Authorization) {
      reply.code(401).send();
    }
  }
);
```


Fastify’s first-class TypeScript support, generics-based request validation, and built-in schema integrations make it the better choice for type safety and maintainability.




## HTTP/2 support
HTTP/2 improves performance, concurrency, and security over HTTP/1.1 by enabling features like multiplexing, header compression, and server push.


Express does not natively support HTTP/2, so external libraries like [`spdy`](https://www.npmjs.com/package/spdy) are required to enable it.

Here’s how to set up HTTP/2 in Express using `spdy`:

```typescript
import express from "express";
import spdy from "spdy";
import fs from "fs";

const app = express();
app.get("/", (req, res) => res.json({ message: "Hello, HTTP/2!" }));

spdy
  .createServer(
    {
      key: fs.readFileSync("./key.pem"),
      cert: fs.readFileSync("./cert.pem"),
    },
    app
  )
  .listen(3000, () => console.log("Server running on https://localhost:3000"));
```
Since Express was designed around HTTP/1, enabling HTTP/2 requires an external dependency and additional manual setup.

On the flip side, Fastify provides built-in HTTP/2 support, making setting up secure and high-performance connections easy without extra dependencies. 

It supports both secure (HTTPS) and plaintext (insecure) configurations and can automatically fall back to HTTP/1 using ALPN negotiation when needed.

Here is an example of a Fastify HTTP/2 Server:

```javascript
import fs from 'fs';
import path from 'path';
import fastify from 'fastify';

const server = fastify({
  http2: true,
  https: {
    key: fs.readFileSync(path.join(__dirname, 'certs', 'server.key')),
    cert: fs.readFileSync(path.join(__dirname, 'certs', 'server.crt')),
    allowHTTP1: true, // Enables fallback to HTTP/1
  },
});

server.get('/', (request, reply) => {
  reply.code(200).send({ message: 'Hello, HTTP/2!' });
});

server.listen(3000, (err, address) => {
  if (err) throw err;
  console.log(`Server listening at ${address}`);
});
...
```
Unlike Express, Fastify’s HTTP/2 support is built into the core, making it a more streamlined and efficient choice for modern web applications.

## Should you switch to Fastify?

If you’re currently using Express, you might be wondering if it’s time to switch to Fastify. The answer depends on what you need from your framework and how you’re using Express.  

Fastify is built for speed and efficiency, offering schema validation, built-in TypeScript support, and automatic error handling. If you're developing APIs, microservices, or performance-critical applications, Fastify can give your app a serious performance boost right out of the box.  

That said, Express isn’t going anywhere. It remains one of the most popular and reliable Node.js frameworks. If you’ve been frustrated by Express’s slow progress in recent years, the good news is that things are finally changing. [Express 5 is here](https://betterstack.com/community/guides/scaling-nodejs/express-5-new-features/), and the framework now has a [clear roadmap for the future](https://github.com/expressjs/discussions/issues/160), including:  

- **Official TypeScript support** – Automatically generated and tested types are on the way, making Express a better fit for modern TypeScript development.  

- **More modular design** – Express is moving toward an API-first approach by removing templating and rendering from its core.  
- **Middleware improvements** – Unused middleware will be phased out, and Express will integrate more native Node.js capabilities for better performance.  
- **Alignment with Node.js LTS schedules** – Express updates will now follow Node.js’s long-term support (LTS) cycle, making upgrades more predictable.  

If you love Express but have been worried about its future, these updates should reassure you that it’s evolving to meet modern development needs.

## Transitioning smoothly from Express to Fastify

If you decide to transition to Fastify, you don’t need to rewrite your entire application overnight. Instead, you can migrate gradually while keeping your existing Express routes and middleware functional.

Fastify provides [`@fastify/express`](https://www.npmjs.com/package/@fastify/express), a compatibility layer that allows Express middleware and applications to run inside Fastify. This lets you transition smoothly without breaking existing functionality.

Start by installing the compatibility plugin with:

```command
npm install @fastify/express
```

Once installed, you can register your existing Express app inside Fastify without significant changes. For example, if you have an existing Express router, you can wrap it in Fastify like this:

```javascript
import Fastify from 'fastify';
import express from 'express';
import expressPlugin from '@fastify/express';

const app = express();
const router = express.Router();

router.use((req, res, next) => {
  res.setHeader("x-custom-header", "true");
  next();
});

router.get("/hello", (req, res) => {
  res.status(200).json({ message: "Hello from Express inside Fastify!" });
});

fastify.register(require("@fastify/express")).after(() => {
  fastify.use(express.urlencoded({ extended: false }));
  fastify.use(express.json());
  fastify.use(router);
});

fastify.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
```

This allows all Express routes to remain functional while Fastify runs the core application. This means you can start using Fastify’s optimizations without losing existing functionality.

If your Express app uses middleware, you can register it inside Fastify using `.use()`, but a better long-term approach is migrating middleware to Fastify’s built-in plugins. For example, instead of using `cors` and `helmet` from Express, you can replace them with `@fastify/cors` and `@fastify/helmet`, which integrate natively with Fastify’s lifecycle.

```javascript
import fastifyCors from '@fastify/cors';
import fastifyHelmet from '@fastify/helmet';

await fastify.register(require("@fastify/cors"));
await fastify.register(require("@fastify/helmet"));
```

This removes unnecessary dependencies and improves performance. Over time, you can begin refactoring your Express routes to use Fastify’s optimized syntax. Instead of defining routes with `req` and `res`, Fastify allows direct return values, making the code cleaner and more efficient. 

A typical Express route like this:

```javascript
app.get("/users", (req, res) => {
  res.json({ message: "Users from Express!" });
});
```

It can be refactored in Fastify like this:

```javascript
fastify.get("/users", async (request, reply) => {
  return { message: "Users from Fastify!" };
});
```

Fastify automatically serializes JSON responses and eliminates the need for `res.send()`, making the migration easier and improving performance. To make the transition smoother, you can encapsulate Express logic inside a subsystem within Fastify. This allows specific parts of your application to run Express middleware while you refactor others into Fastify.

```javascript
fastify.register(async function (subsystem) {
  await subsystem.register(require("@fastify/express"));
  subsystem.use(require("cors")());
});
```

This approach ensures that different parts of your application can be migrated independently without breaking compatibility. Once all routes and middleware have been successfully transitioned, you can remove `@fastify/express` and fully embrace Fastify’s native features.

Fastify also simplifies route prefixing, making it more efficient than Express. In Express, route prefixes must be manually structured, such as defining `v1` and `v2` routes separately:

```javascript
const userRouter = express.Router();
userRouter.get("/v1/user", (req, res) => res.send("User API v1"));
app.use("/", userRouter);
```

Fastify, on the other hand, allows prefixing routes at registration, making the process much cleaner:

```javascript
fastify.register(async (instance) => {
  instance.get("/user", async () => "User API v1");
}, { prefix: "/v1" });
```

Since Fastify compiles routes at startup, its prefixing method improves performance while keeping the structure modular and maintainable.

To ensure a smooth migration, the best approach is to incrementally transition routes, replace middleware with native Fastify plugins, and move away from Express’s request-response handling in favor of Fastify’s return-based approach. Once the migration is complete, removing `@fastify/express` will finalize the transition, allowing you to take full advantage of Fastify’s performance optimizations, better request handling, and built-in scalability.


## Final thoughts

This article compared Fastify and Express to help you decide which fits your needs.  

Fastify is great for performance, modern features, and built-in TypeScript support. Express remains widely used and flexible, now evolving with Express 5 after a long period without major updates.  

If you need speed and built-in features, choose Fastify. If you prefer stability and a vast ecosystem, Express is still a solid choice. 

