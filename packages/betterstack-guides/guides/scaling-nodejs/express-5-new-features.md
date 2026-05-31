# What's New in Express.js v5.0

After a decade-long wait, [Express 5](https://expressjs.com/2024/10/15/v5-release.html) delivers key performance improvements and modernization for Node.js applications. Despite the long development time, **Express 5 is a relatively minor release**.


The focus has been improving core stability, aligning with recent Node.js releases, and fixing bugs rather than introducing significant new features. This cautious approach helped avoid breaking changes for a framework relied upon by millions of developers.

Going forward, **the Express team is implementing a revitalization plan** to ensure the project remains relevant and thrives in the coming years.

Before discussing the future of Express, let's explore the key improvements in Express 5 and how they can benefit your projects.

Lets begin!

[ad-uptime] 

## Promise rejection handling

Express 5 introduces a significant improvement for developers using `async/await` by automatically forwarding rejected promises to error-handling middleware. This change eliminates the need for repetitive `try/catch` blocks, making code cleaner and reducing boilerplate.

Before Express 4, you had to handle promise rejections manually with `try/catch` blocks:

```javascript
app.get('/data', async (req, res, next) => {
  try {
    const result = await fetchData();
    res.send(result);
  } catch (err) {
    next(err);
  }
});
```

With Express 5, you don’t need to handle errors within the route handler explicitly. **Rejected promises are automatically passed to the error-handling middleware**:

```javascript
app.get('/data', async (req, res) => {
  const result = await fetchData();
  res.send(result);
});
```

If `fetchData` throws an error or rejects, Express will automatically pass the error to the error-handling middleware. This eliminates the need to call `next` with the error manually. Express will pass a default `Error` object to the error-handling middleware if no rejected value is provided. 

## Path route matching improvements

Express 5 brings significant updates to route matching by upgrading the `path-to-regexp` library from version 0.x to 8.x. These changes improve security, simplify route definitions, and help mitigate vulnerabilities like [ReDoS attacks](https://owasp.org/www-community/attacks/Regular_expression_Denial_of_Service_-_ReDoS).  

One major change is the removal of "sub-expression" regular expressions. In Express 4, you could write routes with inline regex patterns like this:  

```javascript
// Express 4 example
app.get('/:id(\\d+)', (req, res) => res.send(`ID: ${req.params.id}`));
```  

In Express 5, this type of inline regex is no longer supported due to its susceptibility to ReDoS attacks. Instead, using an [input validation library](https://www.npmjs.com/search?q=validate%20express) for complex patterns is recommended.


The handling of wildcard routes has also changed. In Express 4, the `*` wildcard could be used for broad pattern matching, which could lead to ambiguous routes:  

```javascript
// Express 4 example
app.get('/user*', (req, res) => res.send('User'));
```  

In Express 5, **wildcards need to be explicitly named or replaced with `(.*)`** for clarity and predictability:  

```javascript
// Express 5 example
app.get('/user(.*)', (req, res) => res.send('User'));
```  

Optional parameters have a clearer syntax in Express 5. Instead of `:name?` from Express 4, you now use `{/:name}` for optional segments:  

```javascript
// Express 4 example
app.get('/user/:id?', (req, res) => res.send(req.params.id || 'No ID'));

// Express 5 example
app.get('/user{/:id}', (req, res) => res.send(req.params.id || 'No ID'));
```  

Express 5 also introduces new reserved characters—`(`, `)`, `[`, `]`, `?`, `+`, `&`, and `!`—to avoid conflicts and ensure consistency in route definitions.  

Another change is the requirement for named parameters. In Express 4, unnamed parameters in regex capture groups could be accessed by index:  

```javascript
// Express 4 example
app.get('/user(s?)', (req, res) => res.send(req.params[0])); // 's'
```  

In Express 5, all parameters must have explicit names:  

```javascript
// Express 5 example
app.get('/user:plural?', (req, res) => res.send(req.params.plural));
```  

These improvements make route matching in Express 5 more secure, readable, and maintainable. 

## Stricter error handling for invalid status codes

Express 5 enforces valid HTTP status codes, preventing silent failures and ensuring adherence to HTTP standards. This change helps you catch errors early, making debugging more manageable and improving application response consistency.

In Express 4, if an invalid HTTP status code like `978` was used, the response would still be sent without any warning or error:

```javascript
res.status(978).send('Invalid status');  // Silently fails
```

In Express 5, **attempting to use an invalid status code throws an error**, making the issue immediately visible during development:

```javascript
res.status(978).send('Invalid status');  // Throws an error
```

## Removed methods and properties

Express 5 removed several deprecated methods that persisted from Express 3 and 4. If you’re upgrading to Express 5, you’ll need to address these changes to ensure compatibility.

### `app.del()`

The `app.del()` method has been removed in favor of the standard `app.delete()` for defining DELETE routes. This aligns with modern JavaScript conventions and improves clarity.

Before Express 4:

```javascript
app.del('/route', handler);
```

After Express 5:

```javascript
app.delete('/route', handler);
```

### `req.param(name)`

The `req.param(name)` method has been removed due to its ambiguity. Depending on the context, it could pull data from route parameters, query strings, or the request body, leading to confusion. 

In Express 4, the `req.param(name)` method could access data from multiple sources:

```javascript
app.get('/user/:id', (req, res) => {
  const userId = req.param('id');
  res.send(`User ID: ${userId}`);
});
```

If the request URL was `/user/123?name=John`, `req.param('id')` would correctly return `123` (route parameter). However, if there was a conflicting field in the request body (e.g., `{"id": "456"}`), `req.param('id')` could unexpectedly return `"456"` depending on the context.

Express 5 requires you to use explicit alternatives to ensure clarity and avoid unexpected behavior:

- Use `req.params` for route parameters.
- Use `req.query` for query string parameters.
- Use `req.body` for request body data.

Example:

```javascript
app.get('/user/:id', (req, res) => {
  const userId = req.params.id;     // Route parameter
  const queryName = req.query.name; // Query string parameter
  res.send(`User ID: ${userId}, Name: ${queryName}`);
});
```
### Pluralized methods

Express 5 enforces consistent pluralization for certain `req` methods to reflect their ability to handle multiple values. Update the following methods:

- `req.acceptsCharset()` ➔ `req.acceptsCharsets()`  
- `req.acceptsEncoding()` ➔ `req.acceptsEncodings()`
- `req.acceptsLanguage()`  ➔ `req.acceptsLanguages()` 

These changes provide clearer naming conventions and align with the expected behavior of returning multiple acceptable values.


## Reintroduced `app.router`

In Express 5, the `app.router` object returns as a reference to the base router, simplifying route management by removing the need for explicit initialization. This makes organizing routes more intuitive and helps streamline modular development.

Example of router usage with user management:

```javascript
const express = require('express');
const app = express();
const router = express.Router();

// Middleware to log user-related requests
router.use((req, res, next) => {
  console.log(`User route accessed: ${req.originalUrl}`);
  next();
});

// Define user routes
router.get('/profile', (req, res) => {
  res.send('User profile page');
});

router.post('/signup', (req, res) => {
  res.send('User signup successful');
});

// Mount the router at the /user path
app.use('/user', router);

app.listen(3000, () => console.log('Server running on port 3000'));
```

In this example, requests to `/user/profile` and `/user/signup` are routed through the `router`. The middleware logs each request, providing a simple way to manage and debug user-related routes. 

## Body parser changes in Express 5

Express 5 introduces changes to body parsing that simplify configuration while enhancing security. 


- The previously deprecated `bodyParser()` middleware has been removed. 
- `req.body` is no longer initialized to an empty object by default. This means you must explicitly use the middleware to access body data. If you omit it, `req.body` will remain `undefined`.

The `express.urlencoded()` parser now limits nested objects to a default depth of `32`, customizable as needed. For example, to set a depth of `10`:


```javascript
app.use(express.urlencoded({ depth: 10 }));
```

Additionally, the `extended` option in `express.urlencoded()` now defaults to `false`, allowing only flat objects:

```javascript
app.use(express.urlencoded());
```

Express 5 supports Brotli compression for smaller response payloads. Enable it with:

```javascript
app.use(compression({ brotli: { enabled: true } }));
```


## End of support for older Node.js versions

Express 5 now requires Node.js 18 or higher to embrace modern JavaScript features and practices. This shift lets Express replace outdated third-party packages like `array-flatten` and `path-is-absolute` with native methods such as `Array.flat()` and `path.isAbsolute()`. 

By relying on Node.js’s recent advancements, Express 5 simplifies its codebase, reduces external dependencies, and stays in sync with the latest improvements for better performance and security.

## Moving Express forward: what’s next

The Express team is taking big steps to revitalize the project and ensure it continues to serve the community well. After being in maintenance mode for a long time, there’s a clear plan to move things forward, modernize the framework, and bring new energy to the project.

With Express 5  released, the plan is to update  [Express Generator](https://expressjs.com/en/starter/generator.html) to use it by default.


Looking beyond Express 5, the team has some exciting ideas for Express 6. They aim to align with [Node.js LTS schedules](https://github.com/nodejs/Release?tab=readme-ov-file#release-schedule) to make upgrades smoother and more predictable. Some older or unused middleware will be removed or replaced with native Node.js solutions to keep things clean and efficient. Templating and rendering will also be moved out of the core, making Express more focused on APIs.

For Express 7, the vision is even broader. The team plan to collaborate with Node.js core developers to improve performance and address the future of many Express-owned modules. This collaboration will focus on integrating better support for Web Platform standards like `Request`, `Response`, and `URL`. 

They also aim to modernize Express to support popular technologies like meta-frameworks, GraphQL, and gRPC. A new **release schedule will mirror Node.js LTS**, making it easier for you to plan upgrades. There’s even talk of building a new website to reflect these changes.


This renewed effort is all about bringing Express back to life with fresh ideas, better organization, and a supportive community.

## Should you upgrade to Express 5?

If you're using Node.js 18 or higher, upgrading to Express 5 is highly recommended. It provides enhanced security, improved performance, and full support for modern JavaScript features, making it a worthwhile upgrade with no significant downsides.

Before upgrading, review the [migration guide](https://expressjs.com/en/guide/migrating-5.html) and run your test suite to identify potential breaking changes. 

Verify that your Node.js version is 18 or higher, ideally the LTS version, by running:

```command
node -v
```
```text
[output]
v22.12.0
```

Using [`nvm` (Node Version Manager)](https://github.com/nvm-sh/nvm) is a reliable way to manage your Node versions:


Once you're ready, install Express 5 with:

```comamnd
npm install express@next
```

After installation, run your tests to identify any compatibility issues. Update deprecated methods or route patterns to ensure a smooth transition and future-proof your application.

## Final thoughts

Express 5 marks a significant leap forward for one of the most widely used Node.js frameworks. After a long development period that made the project feel stagnant, this release brings meaningful improvements that make building faster, safer, and more maintainable applications easier.

For a deeper dive into the new features and changes, refer to the full release notes and migration guide:

- [Express 5 Release Notes](https://expressjs.com/2024/10/15/v5-release.html)  
- [Migration Guide](https://expressjs.com/en/guide/migrating-5.html)

Thank you and happy coding! 