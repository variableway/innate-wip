# Express Error Handling Patterns


Error handling is essential for building stable, secure, and maintainable web applications in Express.js. Web applications encounter various failures without a proper error-handling mechanism, leading to crashes, exposure of sensitive information, or confusing error responses for users.  

This guide explores the best error-handling patterns for your application. By the end of this article, you will have a scalable and resilient error-handling setup.


## What are errors in Express.js?  

Errors in Express.js are instances of JavaScript’s built-in `Error` object. They generally fall into three main categories:  

### Operational errors (expected failures)  
These errors result from external conditions rather than bugs in the code. They are expected and should be handled properly to maintain application stability.  

The following are some of the examples:

- A user requests a resource that does not exist (`404 Not Found`).  
- Invalid input triggers a validation failure (`400 Bad Request`).  
- A database connection fails due to a network issue (`500 Internal Server Error`).  
- An API request times out or fails because of external factors.  

### Programmer errors (bugs)  
These errors result from mistakes in the code and usually require fixing rather than handling at runtime. 

For instance, calling a function that does not exist leads to a `ReferenceError`, while passing incorrect arguments to a function may trigger a `TypeError`. 

Attempting to access an undefined variable can cause unexpected behavior, and failing to handle promise rejections properly may result in unhandled errors affecting application stability.

### System Errors  
These errors occur at the operating system or hardware level. While they are less common, they can crash an Express app if not handled correctly. 

For example, a file system error may occur when reading or writing files, preventing the application from functioning correctly. 

A database connection failure can happen due to network or server issues, disrupting data retrieval. Memory leaks or hardware-related crashes can cause excessive resource consumption, leading to performance degradation or application failure.  


Now that we understand the different types of errors in Express.js, the next step is learning how to handle them effectively.


## Handling errors in asynchronous code
Express provides built-in mechanisms for handling errors in asynchronous code. The approach differs slightly between Express 4 and Express 5, so understanding the correct way to structure your routes is important.  

In Express 4, errors in `async` functions **do not automatically propagate to the error handler**. If an error occurs and is not explicitly forwarded, the application may crash or fail to send a response.  

```javascript
app.get("/books/:id", async (req, res) => {
  const book = await db.get("SELECT * FROM books WHERE id = ?", [req.params.id]);
  if (!book) throw new Error("Book not found"); // Uncaught error
  res.json(book);
});
```
Here, if `db.get()` fails, Express 4 does not catch the error. The correct approach is to use a `try/catch` block and forward errors to the next middleware using `next(error)`.  

```javascript
app.get("/books/:id", async (req, res, next) => {
  try {
    const book = await db.get("SELECT * FROM books WHERE id = ?", [req.params.id]);
    if (!book) throw new Error("Book not found");
    res.json(book);
  } catch (error) {
    next(error); // Forward error to the global error handler
  }
});
```
This ensures errors inside the route are passed to Express’s error-handling middleware rather than causing an unhandled promise rejection.  


Express 5 improves error handling by **automatically propagating errors from async functions** to the error handler. The `next(error)` call is no longer necessary when an error is thrown inside an `async` route.  

```javascript
app.get("/books/:id", async (req, res) => {
  const book = await db.get("SELECT * FROM books WHERE id = ?", [req.params.id]);
  if (!book) throw new Error("Book not found"); // Automatically caught by Express 5
  res.json(book);
});
```
With this pattern, Express 5 forwards any unhandled errors from `async` functions to the global error handler. This simplifies the code and removes the need for repetitive try/catch blocks inside each route.  

## Using a global error-handling middleware  

Express provides a mechanism for centralizing error handling by defining an error-handling middleware. This middleware is a single place where all application errors are processed and responded to.  


Instead of handling errors separately inside each route, errors should be thrown or passed to `next(error)`, allowing the global error handler to take over.  

```javascript
app.get("/books/:id", async (req, res, next) => {
  try {
    const book = await db.get("SELECT * FROM books WHERE id = ?", [req.params.id]);
    if (!book) throw new Error("Book not found");
    res.json(book);
  } catch (error) {
    next(error); // Forward error to global handler
  }
});
```
Here, errors are not directly handled inside the route but are forwarded to the error-handling middleware using `next(error)`.  

The error-handling middleware should be placed at the end of all route definitions to catch any errors that occur during request processing.  

```javascript
[label middlewares/errorHandler.js]
export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.message);

  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
};
```
This middleware ensures that all errors are handled consistently and that error responses follow a structured format.  

Once the error-handling middleware is defined, it must be registered **after all routes** to ensure it catches errors from any route in the application.  

```javascript
[highlight]
import { errorHandler } from "./middlewares/errorHandler.js";
[/highlight]
...
app.get("/books/:id", async (req, res, next) => {
  ...
});
[highlight]
app.use(errorHandler); // Register error-handling middleware
[/highlight]
```

This approach offers several benefits that enhance the maintainability and reliability of an application. It reduces code duplication, resulting in a cleaner and more manageable codebase. 

Additionally, it ensures uniform error responses across all API endpoints, establishing a standardized and predictable way to handle errors.


## Using custom error classes  

In many applications, errors come from different sources—validation failures, database issues, authentication problems, and more.

 Instead of generic error objects, a structured approach with custom error classes helps differentiate errors and improves debugging.  


When you create specific error classes, errors can carry additional context beyond just a message. This allows the error handler to differentiate between application-specific errors and unexpected failures.  

A custom error class should extend the built-in `Error` class while adding additional properties, such as an HTTP status code.  

```javascript
[label utils/AppError.js]
class AppError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}
```
This allows errors to be instantiated with a message and an HTTP status code.  

```javascript
throw new AppError("Book not found", 404);
```
Instead of manually setting error messages and status codes in each route, custom error classes make the code cleaner.  

```javascript
app.get("/books/:id", async (req, res) => {
  const book = await db.get("SELECT * FROM books WHERE id = ?", [req.params.id]);
  if (!book) throw new AppError("Book not found", 404); // Automatically forwarded to error handler
  res.json(book);
});
```

The global error handler should recognize custom error classes and return their status codes.  

```javascript
[label middlewares/errorHandler.js]
export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.message);

  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
};
```

More specialized error classes can be created for scenarios like validation errors or authentication failures.  

```javascript
[label utils/ValidationError.js]
class ValidationError extends AppError {
  constructor(message, details) {
    super(message, 400);
    this.details = details; // Additional validation details
  }
}
```
This allows API responses to provide more useful information:  

```json
{
  "status": "error",
  "message": "Invalid input",
  "details": ["Title is required", "Author name must be at least 3 characters"]
}
```

To maintain consistency and clarity in error handling,a base `AppError` class should be implemented to standardize the error structure across the application. 

Custom error classes such as `ValidationError` or `AuthError` should extend the base `AppError` class for more specific scenarios. This ensures that different errors are properly categorized and handled according to context.  

The global error handler must also be designed to recognize and process these custom errors correctly.

## Handling uncaught exceptions and unhandled promise rejections

Errors in Express applications are not always confined to request handlers. They can occur in background tasks, database connections, or external API calls. If these errors are not properly handled, they can cause the application to crash unexpectedly.  

Errors that occur outside of Express routes, such as missing `try/catch` blocks in asynchronous functions or failed database connections, need dedicated handling mechanisms. Express alone does not catch these failures, so it is essential to use process-level error handlers.  


An uncaught exception is a synchronous error never caught using `try/catch`. These errors can leave the application unstable, so they should be logged, and the process should exit gracefully.  

```javascript
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err.message);
  process.exit(1); // Exit to prevent an unstable state
});
```

If a promise is rejected and there is no `.catch()` handler, it will result in an unhandled rejection. Future versions of Node.js may terminate applications immediately when this happens, so it is important to handle such cases explicitly.  

```javascript
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err.message);
  process.exit(1);
});
```


To ensure reliable error handling, these process-level handlers should be included in the main application file, such as `index.js` or `server.js`:

```javascript
import express from "express";
...
app.use(errorHandler);

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err.message);
  process.exit(1); // Exit to prevent an unstable state
});

// Handle unhandled promise rejections (async errors outside Express)
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err.message);
  process.exit(1);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```
When an error of this nature occurs, the process should exit, but it should also be restarted automatically. Using a process manager such as [PM2](https://betterstack.com/community/guides/scaling-nodejs/pm2-guide/) ensures the application restarts if it crashes.  

```command
pm2 start server.js --restart-delay=5000
```

When implementing these practices, Express applications remain resilient against crashes caused by unexpected errors outside the request-response cycle.

## Using `AbortController` to cancel slow requests

Setting a timeout is essential when making API requests from an Express server to prevent requests from hanging indefinitely. 

The [`AbortController` API](https://betterstack.com/community/guides/scaling-nodejs/understanding-abortcontroller/) provides a simple yet powerful way to handle timeouts by allowing requests to be aborted if they exceed a predefined time limit.

Unlike fixed timeout settings in external libraries, `AbortController` works natively with `fetch()`, providing greater control over request cancellation.

Instead of waiting indefinitely for a response from an external API, an abort signal can be used to cancel the request after a specified duration. This prevents wasted resources on stalled connections and improves response times.


 An `AbortController` instance is created in an Express route, and a timeout is set to abort the request if it exceeds five seconds automatically. If the request is aborted, an error handler ensures the client receives a `504 Gateway Timeout` response:

```javascript
app.get("/data", async (req, res, next) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000); // Abort after 5s

  try {
    const response = await fetch("https://api.example.com/data", {
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error("Failed to fetch external data");
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    if (error.name === "AbortError") {
      next(new AppError("Request timed out", 504)); // Gateway Timeout
    } else {
      next(new AppError("External API failed", 502));
    }
  } finally {
    clearTimeout(timeout);
  }
});
```

By implementing `AbortController`, Express applications prevent indefinite waiting on API responses, leading to better performance and reliability. 

In cases where a request is aborted due to timeout, retrying the request can help recover from transient failures. A **retry mechanism with exponential backoff** allows multiple attempts before considering the request a failure. 


The following example demonstrates retrying a request up to three times in case of a timeout:

```javascript
const fetchWithTimeout = async (url, retries = 3) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(url, { signal: controller.signal });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      return await response.json();
    } catch (error) {
      if (error.name === "AbortError") {
        console.warn(`Timeout attempt ${attempt}. Retrying...`);
      } else {
        throw error;
      }
    } finally {
      clearTimeout(timeout);
    }
  }
  throw new AppError("External API failed after retries", 502);
};
```

Using `AbortController` provides several key benefits. It prevents API requests from stalling indefinitely, works seamlessly with native `fetch()`, and enables dynamic request cancellation based on changing conditions. 

To ensure efficiency, clearing timeouts is essential to avoid memory leaks, and combining timeouts with retry mechanisms enhances resilience against temporary network failures. 

## Implementing rate limiting to prevent overloading the server

A critical aspect of error handling is preventing errors before they happen. It may slow down or crash if an Express application is overwhelmed by excessive requests—whether due to legitimate high traffic or a denial-of-service (DoS) attack.

Implementing rate limiting ensures the server remains responsive under heavy load.  

Rate limiting restricts a client's requests within a given time frame. This helps:  
- Prevent abuse from malicious users.  
- Reduce strain on database and API resources.  
- Improve reliability by maintaining system performance.  


The [`express-rate-limit`](https://www.npmjs.com/package/express-rate-limit) package provides an easy way to enforce request limits.  

This middleware limits each IP to 100 requests per 15 minutes and responds with a `429 Too Many Requests` error if the limit is exceeded.  

```javascript
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { status: "error", message: "Too many requests, please try again later." },
});

app.use(limiter); // Apply rate limiting to all routes
...
```
Rate limits can be adjusted based on the sensitivity of different endpoints. For example, authentication routes should have stricter limits to prevent brute-force attacks.  

```javascript
const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // Limit to 5 attempts per 10 minutes
  message: { status: "error", message: "Too many failed login attempts. Try again later." },
});

app.post("/login", loginLimiter, (req, res) => {
  // Login logic
});
```
For larger applications, rate limiting should be implemented at the API gateway level (e.g., Nginx, Cloudflare, or AWS API Gateway) instead of just within Express.  


## Logging errors for debugging and monitoring 

Handling errors properly ensures an application remains stable, but logging errors is equally important. Without logs, diagnosing failures in production environments becomes difficult. A structured logging approach helps track issues, analyze trends, and improve system reliability.  

Instead of relying on `console.log()`, a dedicated logging tool should be used to capture and format error messages. Logging should include:  

- The error message  
- The status code  
- The request URL and method  
- A timestamp  
- The user ID (if available)  

Using a structured logging library like [Pino](https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-pino-to-log-node-js-applications/) or [Winston](https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-winston-and-morgan-to-log-node-js-applications/) improves log management by formatting logs and allowing them to be stored in external monitoring systems. 

To set up logging, a logger instance can be created using `pino`, ensuring logs are structured and easily readable.

```javascript
[label utils/logger.js]
import pino from "pino";

export const logger = pino({
  level: "info",
  transport: {
    target: "pino-pretty", // Formats logs for better readability in development
  },
});
```

Logging should not be limited to error responses; all critical errors should be recorded for better debugging and analysis. Integrating logging within the global error handler ensures that errors are captured along with essential metadata.

```javascript
import { logger } from "../utils/logger.js";

export const errorHandler = (err, req, res, next) => {
  logger.error({
    message: err.message,
    status: err.status || 500,
    method: req.method,
    url: req.originalUrl,
    timestamp: new Date().toISOString(),
  });

  res.status(err.status || 500).json({
    status: "error",
    message: "An unexpected error occurred",
  });
};
```

Additionally, implementing a request logging middleware provides insights into incoming requests, beneficial for debugging production issues. Logging request details such as HTTP method and URL helps track API usage and detect anomalies.

```javascript
app.use((req, res, next) => {
  logger.info({ method: req.method, url: req.originalUrl });
  next();
});
```

A well-structured logging system ensures that errors and requests are recorded in a way that aids troubleshooting and performance monitoring. 

## Centralizing logs with Better Stack 

Effective log centralization enhances observability, simplifies debugging, and ensures errors are detected and addressed before escalating. 


Better Stack provides a streamlined way to monitor real-time logs, apply attribute-based filters, and set up automated alerts for critical issues. This improves system stability, enhances debugging efficiency, and enables proactive issue resolution.

Pino can be configured to send logs directly to Better Stack for centralized monitoring. The following setup routes log data to Better Stack using the [`@logtail/pino`](https://www.npmjs.com/package/@logtail/pino) transport:

```javascript
[label utils/logger.js]
import pino from "pino";

const transport = pino.transport({
  targets: [
    {
      target: "@logtail/pino",
      options: { sourceToken: "<your_better_stack_source_token>" }, // Send logs to Better Stack
    },
  ],
});

export const logger = pino({ level: "info" }, transport);
```

Once configured, logs will be visible within the Better Stack interface, allowing for efficient real-time monitoring and structured log analysis.

![Better Stack Logs Interface](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/3b30fac2-a54e-47bc-954a-0208b7c5f600/orig =3024x1530)~

## Final thoughts
Effective error handling is essential for building secure and stable Express.js applications. This article explored key error-handling patterns to enhance application reliability and prevent unexpected failures.  

With these best practices, you can confidently manage errors in Express.js and build a more resilient backend system.
