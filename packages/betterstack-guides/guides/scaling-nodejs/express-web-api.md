# Building Web APIs with Express: A Beginner's Guide

[Express](https://expressjs.com/) is the most popular web framework for Node.js, offering a minimalist yet powerful toolkit for crafting everything from simple microservices to complex multi-route applications.

Its middleware-based architecture and intuitive interface make it particularly well-suited for API development, especially in scenarios where performance and maintainability are essential.

This guide will walk you through the process of building a full-featured blog API with Express 5 and Sequelize ORM with SQLite. You'll learn how the Express ecosystem approaches routing, data validation, database integration, and error handling.


## Prerequisites

Before getting started, ensure you have:

- Node.js installed on your system (preferably the latest LTS version, Node.js 22.x or higher)
- A basic understanding of JavaScript, Node.js, and web development concepts

## Step 1 — Setting up the Express project

To begin, you'll scaffold your project structure to keep your Node.js application organized, maintainable, and scalable.

First, create a dedicated project folder that will serve as the base for your API:

```command
mkdir express-blog-api && cd express-blog-api
```

Initialize the Node.js project with npm's defaults, which creates a basic `package.json` file:

```command
npm init -y
```

Now, configure your project to use ES modules by default:

```command
npm pkg set type="module"
```

Then, install the core dependencies required for your API:

```command
npm install express@next sequelize sqlite3 express-validator morgan cors uuid
```

Here's a brief overview of each dependency and its role in your API architecture:

- [`express@next`](https://expressjs.com/) – Installs Express 5 (beta), a lightweight framework for handling HTTP requests and responses.
- [`sequelize`](https://sequelize.org/) – A JavaScript ORM that simplifies database interactions through models.
- [`sqlite3`](https://github.com/TryGhost/node-sqlite3) – A compact, serverless SQL database ideal for development and testing.
- [`express-validator`](https://express-validator.github.io/docs/) – Middleware for validating and sanitizing incoming request data.
- [`morgan`](https://github.com/expressjs/morgan) – A lightweight HTTP request logger that helps monitor API traffic.
- [`cors`](https://github.com/expressjs/cors) – Middleware enabling Cross-Origin Resource Sharing (CORS), allowing secure API access from different origins.
- [`uuid`](https://github.com/uuidjs/uuid) – A utility to generate universally unique identifiers for database records.


Next, create your main application file, `app.js`. This file initializes your Express server and sets up essential middleware:

```javascript
[label app.js]
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

// Create Express application
const app = express();

// Middleware
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Blog API' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

This initialization sets up your Express application, beginning with importing key dependencies. It then applies middleware to log HTTP requests, enable cross-origin resource sharing, and parse incoming JSON data.

 To verify that the API is functioning correctly, it defines a simple root route that returns a welcome message. Once configured, the server starts listening on the specified port and logs a confirmation message to the console, signaling that it's ready to handle requests.

Now, update your project's start script in `package.json` to use Node.js's built-in watch mode. This allows the server to restart whenever you make changes automatically:

```command
npm pkg set scripts.start="node --watch app.js"
```

Start the application with:

```command
npm start
```

You'll see output like this:

```text
[output]
> express-blog-api@1.0.0 start
> node --watch app.js

Server running on http://localhost:3000
```

This indicates your Express server is active. To test it, open `http://localhost:3000/` in your browser:


![Screenshot of the Web browser displaying the homepage of a running Express server](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/c9264c2d-682f-4c9a-3ae9-96fbc6ff7300/orig =3248x1998)


At this point, your Express API is set up and running. In the next step, you'll integrate a database using Sequelize with SQLite.


## Step 2 — Configuring the database with Sequelize

Now that your Express server is running, you'll set up persistent data storage with Sequelize, a promise-based Node.js ORM. It will map JavaScript objects to database tables without raw SQL. While it supports multiple databases, you'll configure it with SQLite for simplicity.

First, create a directory for your database configuration in the root directory:

```command
mkdir -p config
```

Create a new file called `config/database.js` with the following contents:

```javascript
[label config/database.js]
import { Sequelize } from 'sequelize';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// ES modules don't have __dirname, so we create it
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database path
const dbPath = path.join(__dirname, '..', 'data', 'blog.db');

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: console.log
});

// Test the connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

// Call the test function
testConnection();

export default sequelize;
```

This configuration connects your Express app to an SQLite database. Since ES modules lack the `__dirname` global available in CommonJS, we recreate it using `fileURLToPath` to handle file paths correctly across platforms.

The `testConnection` function runs immediately when this module is imported, ensuring the database connection works and helping catch configuration issues early.

Make sure to create the `data` directory in the root directory:

```command
mkdir -p data
```

Now, update your `app.js` file to import and initialize the database:

```javascript
[label app.js]
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
[highlight]
import sequelize from './config/database.js';
[/highlight]

// Create Express application
const app = express();

// Middleware
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

[highlight]
// Initialize database
async function initDb() {
  try {
    // This will create tables based on models (we'll define these soon)
    await sequelize.sync();
    console.log('Database synchronized');
  } catch (error) {
    console.error('Failed to sync database:', error);
  }
}
[/highlight]

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Blog API' });
});

// Start server
const PORT = process.env.PORT || 3000;
[highlight]
app.listen(PORT, async () => {
[/highlight]
  console.log(`Server running on http://localhost:${PORT}`);
  
[highlight]
  // Initialize database after server starts
  await initDb();
[/highlight]
});
```
Since database operations are asynchronous, `app.listen` uses an `async` callback to ensure `initDb` completes before handling requests.

At this point, you've established a connection between Express and our SQLite database through Sequelize. 

Save the file, and Node.js will restart automatically:

```text
[output]
Restarting 'app.js'
Server running on http://localhost:3000
Executing (default): SELECT 1+1 AS result
Executing (default): SELECT 1+1 AS result
Database synchronized
Database connection established successfully.
```
This confirms that your database is set up and syncing correctly.

Now, you need to define your data by creating model definitions, which you'll tackle in the next step.


## Step 3 — Creating the post model with Sequelize

With your database connection established, you need to define the structure of your data. Instead of class-based models, Sequelize uses a declarative approach where you define models by calling the define method on the Sequelize instance.

This section walks you through creating a blog post model with built-in validation, automatic timestamps, and UUID primary keys.
 

Create a models directory in the root directory to keep your code organized:

```command
mkdir -p models
```

Create a file called `models/post.js`:

```javascript
[label models/post.js]
import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import sequelize from '../config/database.js';

const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      len: [3, 100]
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [10, Infinity]
    }
  },
  published: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  // Use created_at and updated_at instead of createdAt and updatedAt
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  
  // Use posts as the table name
  tableName: 'posts'
});

export default Post;
```

This model demonstrates key Sequelize patterns. The `define` method creates a model with both database schema definitions and validation rules:

- `id`: Uses UUID v4 as the primary key, automatically generated for each record.  
- `title`: A string field with length constraints and server-side validation.  
- `content`: A text field with a minimum length to prevent empty content.  
- `published`: A boolean field with a default value to control content visibility.  
- `created_at` and `updated_at`: Renamed from Sequelize's default camelCase to snake_case for consistency.  


Now save the changes. You should see output confirming that Sequelize has created the `posts` table:

```text
Server running on http://localhost:3000
Executing (default): SELECT name FROM sqlite_master WHERE type='table' AND name='posts';
Executing (default): SELECT 1+1 AS result
Executing (default): CREATE TABLE IF NOT EXISTS `posts` (`id` UUID PRIMARY KEY, `title` VARCHAR(100) NOT NULL, `content` TEXT NOT NULL, `published` TINYINT(1) DEFAULT 1, `created_at` DATETIME NOT NULL, `updated_at` DATETIME NOT NULL);
Database connection established successfully.
Executing (default): PRAGMA INDEX_LIST(`posts`)
Executing (default): PRAGMA INDEX_INFO(`sqlite_autoindex_posts_1`)
Database synchronized
```

With the `Post` model set up, you now have a structured way to interact with your database. Next, you'll use it to implement CRUD operations.


## Step 4 — Setting up validation with `express-validator`

Express doesn't include built-in request validation like some frameworks do. Instead, it relies on middleware patterns to handle validation concerns. 

The `express-validator` package brings validation capabilities to Express through a middleware-based approach that intercepts and validates requests before they reach your route handlers.

To implement validation, create a directory for your validators:

```command
mkdir -p validators
```

Create a file called `validators/post.js`. Let's start with the core validation result-checking function:

```javascript
[label validators/post.js]
import { body, query, param, validationResult } from 'express-validator';

// Middleware to validate results
const validateResults = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ 
      errors: errors.array(),
      status: 'Unprocessable Entity' 
    });
  }
  next();
};
```

This `validateResults` function is a middleware that checks if any validation errors were detected. If there are errors, it returns a 422 status code detailing what failed. If validation passes, it calls `next()` to continue to the next middleware or route handler.

Now, add validation for post creation and updates:

```javascript
[label validators/post.js]
... 
// Validate post creation/update
const validatePost = [
  body('title')
    .isString()
    .withMessage('Title must be a string')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('content')
    .isString()
    .withMessage('Content must be a string')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Content must be at least 10 characters'),
  body('published')
    .optional()
    .isBoolean()
    .withMessage('Published flag must be a boolean'),
  validateResults
];
```

The `validatePost` array combines multiple validation rules in sequence:

1. It checks that the title is a string with a length between 3-100 characters
2. It validates that content is a string with at least 10 characters
3. It allows an optional published flag that must be a boolean when present
4. Finally, it runs our `validateResults` function to check if any validations failed

Let's also add validations for query parameters and route parameters:

```javascript
[label validators/post.js]
...
// Validate query parameters
const validatePostQuery = [
  query('published')
    .optional()
    .isBoolean()
    .withMessage('Published query parameter must be a boolean')
    .toBoolean(),
  validateResults
];

// Validate post ID parameter
const validatePostId = [
  param('id')
    .isUUID(4)
    .withMessage('Post ID must be a valid UUID'),
  validateResults
];

export { validatePost, validatePostQuery, validatePostId };
```

These additional validators serve specific purposes:

- `validatePostQuery` handles URL query parameters, like filtering by publication status
- `validatePostId` ensures route parameters contain valid UUIDs when accessing specific posts

What makes `express-validator` powerful is how these validators operate as middleware chains that run before your route handlers. 

If validation fails, the request never reaches your business logic, keeping your route handlers focused only on successful cases.


## Step 5 — Implementing the POST endpoint for creating blog posts

With the model and validation in place, the next step is to create an API endpoint for adding new blog posts. Express uses a router system to keep routes modular and organized. 

Create a `routes` directory in the project's root to manage API routes:

```command
mkdir -p routes
```

Next, create a file called `routes/posts.js`:

```javascript
[label routes/posts.js]
import express from 'express';
import Post from '../models/post.js';
import { validatePost, validatePostQuery, validatePostId } from '../validators/post.js';

const router = express.Router();

// Create a new post
router.post('/', validatePost, async (req, res) => {
  try {
    const post = await Post.create({
      title: req.body.title,
      content: req.body.content,
      published: req.body.published
    });
    
    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

export default router;
```

This implementation uses the Express Router to define our routes modularly. The POST route handler uses `async/await syntax`, which works well with Sequelize's promise-based API. The `validatePost` middleware runs first, ensuring only valid data reaches our handler where we use Sequelize's `create` method to insert a new record into the database.

Now, update your `app.js` file to import and use the posts router:

```javascript
[label app.js]
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import sequelize from './config/database.js';
[highlight]
import postsRouter from './routes/posts.js';
[/highlight]

// Create Express application
const app = express();

// Middleware
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

[highlight]
// Routes
app.use('/api/posts', postsRouter);
[/highlight]

// Initialize database
async function initDb() {
  // ... existing code
}

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Blog API' });
});

// ... rest of your app.js file
```

This mounts the posts router on the `/api/posts` path, making all routes defined in the router accessible under this URL prefix. Each router acts as a self-contained mini-application that can be attached anywhere in the middleware stack.

After that, save your changes and test by creating a new blog post using `curl`:


```command
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"My First Blog Post","content":"This is the content of my first blog post. Express makes API development easy and enjoyable!"}' \
  -s | jq
```

You should receive a response like this:

```json
[output]
{
  "id": "997e5cd6-277b-4b52-b9bd-ef63de18a28e",
  "published": true,
  "title": "My First Blog Post",
  "content": "This is the content of my first blog post. Express makes API development easy and enjoyable!",
  "updated_at": "2025-03-18T11:09:57.510Z",
  "created_at": "2025-03-18T11:09:57.510Z"
}
```

Test validation by trying to create a post with an invalid title (too short):

```command
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Hi","content":"This content is valid but the title is too short."}' \
  -s | jq
```

You should receive a validation error:

```json
[output]

{
  "errors": [
    {
      "type": "field",
      "value": "Hi",
      "msg": "Title must be between 3 and 100 characters",
      "path": "title",
      "location": "body"
    }
  ],
  "status": "Unprocessable Entity"
}
```

This demonstrates how `express-validator` validates incoming data before reaching your route handler, ensuring data integrity and providing clear, helpful error messages to API consumers.

## Step 6 — Implementing the GET endpoints for retrieving blog posts

Now that you can create blog posts, you will implement functionality to retrieve them. Let's start with retrieving a collection of posts with optional filtering.

First, update your `routes/posts.js` file to add a GET method for retrieving all posts:

```javascript
[label routes/posts.js]
import express from 'express';
import Post from '../models/post.js';
import { validatePost, validatePostQuery, validatePostId } from '../validators/post.js';

const router = express.Router();

// Create a new post
router.post('/', validatePost, async (req, res) => {
  // ... existing code
});

[highlight]
// Get all posts with optional filtering
router.get('/', validatePostQuery, async (req, res) => {
  try {
    const where = {};
    
    // Add published filter if provided
    if (req.query.published !== undefined) {
      where.published = req.query.published;
    }
    
    const posts = await Post.findAll({ 
      where,
      order: [['created_at', 'DESC']]
    });
    
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});
[/highlight]
export default router;
```

This endpoint returns multiple posts with filtering options. It uses Sequelize's query builder to filter records by publication status and sorts them by creation date (newest first). 

The `validatePostQuery` middleware ensures that any query parameters are valid before running the database query.

Save your changes and test this endpoint by retrieving all posts:

```command
curl http://localhost:3000/api/posts -s | jq
```

You should see all the posts you've created so far:

```json
[output]
[
  {
    "id": "997e5cd6-277b-4b52-b9bd-ef63de18a28e",
    "title": "My First Blog Post",
    "content": "This is the content of my first blog post. Express makes API development easy and enjoyable!",
    "published": true,
    "created_at": "2025-03-18T11:09:57.510Z",
    "updated_at": "2025-03-18T11:09:57.510Z"
  }
```


Now that you've implemented and tested post listing, it's time to add functionality to retrieve a single post by its ID. Insert the following method into your `routes/posts.js` file:


```javascript
[label routes/posts.js]
// ... existing code

// Get all posts with optional filtering
router.get('/', validatePostQuery, async (req, res) => {
  // ... existing code
});

[highlight]
// Get a specific post by ID
router.get('/:id', validatePostId, async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: `Post with ID ${req.params.id} not found` });
    }
    
    res.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});
[/highlight]
export default router;
```

This endpoint retrieves a single post by its ID. It uses route parameters `:id` to capture the resource identifier and Sequelize's `findByPk` method for direct primary key lookup. The `validatePostId` middleware ensures the ID is a valid UUID before attempting to retrieve the post.

Save your changes and test retrieving a single post by ID (replace with an actual ID from your database):

```command
curl http://localhost:3000/api/posts/997e5cd6-277b-4b52-b9bd-ef63de18a28e -s | jq
```

You should receive the specific post:

```json
[output]
{
  "id": "997e5cd6-277b-4b52-b9bd-ef63de18a28e",
  "title": "My First Blog Post",
  "content": "This is the content of my first blog post. Express makes API development easy and enjoyable!",
  "published": true,
  "created_at": "2025-03-18T11:09:57.510Z",
  "updated_at": "2025-03-18T11:09:57.510Z"
}
```

Try requesting a non-existent post to see the error handling:

```command
curl http://localhost:3000/api/posts/00000000-0000-0000-0000-000000000000 -s | jq
```

```json
[output]

{
  "errors": [
    {
      "type": "field",
      "value": "00000000-0000-0000-0000-000000000000",
      "msg": "Post ID must be a valid UUID",
      "path": "id",
      "location": "params"
    }
  ],
  "status": "Unprocessable Entity"
}
```

With these GET endpoints implemented, your API now supports creating and retrieving blog posts. In the next step, you'll implement the ability to update existing blog posts.

## Step 7 — Implementing the PUT endpoint for updating blog posts

After implementing creation and retrieval, you will update existing posts. In RESTful design, `PUT` requests replace the entire resource, allowing changes to the title, content, or publication status.  

Add this endpoint to enable post updates:

```javascript
[label routes/posts.js]
// ... existing imports and routes

// Get a specific post by ID
router.get('/:id', validatePostId, async (req, res) => {
  // ... existing code
});

[highlight]
// Update a specific post
router.put('/:id', validatePostId, validatePost, async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: `Post with ID ${req.params.id} not found` });
    }
    
    // Update post fields
    post.title = req.body.title;
    post.content = req.body.content;
    
    // Only update published status if provided
    if (req.body.published !== undefined) {
      post.published = req.body.published;
    }
    
    await post.save();
    
    res.json(post);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Failed to update post' });
  }
});
[/highlight]

export default router;
```

This PUT endpoint combines two validation middleware chains—one for the URL parameter (`validatePostId`) and another for the request body (`validatePost`). The handler follows a two-step process:

1. First, it retrieves the existing post using `findByPk`
2. Then it manually updates the post's properties and saves the changes

This approach gives us more control over conditional updates (like the published flag) and ensures we can return the complete updated entity in the response.

Save your changes and test the endpoint by updating one of the posts you created earlier. Replace the ID in the URL with an actual ID from your database:

```command
curl -X PUT http://localhost:3000/api/posts/PASTE_POST_ID_HERE \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Blog Post Title","content":"This content has been updated. Express makes updating API resources easy!"}' \
  -s | jq
```

You should receive a response with the updated post:

```json
[output]
{
  "id": "997e5cd6-277b-4b52-b9bd-ef63de18a28e",
  "title": "Updated Blog Post Title",
  "content": "This content has been updated. Express makes updating API resources easy!",
  "published": true,
  "created_at": "2025-03-18T11:09:57.510Z",
  "updated_at": "2025-03-18T11:23:41.923Z"
}
```

Notice that while the `created_at` timestamp remains the same, the `updated_at` timestamp has been updated to reflect the modification time.

You can also try updating the publication status of a post. This is useful for changing a draft post to published or vice versa:

```command
curl -X PUT http://localhost:3000/api/posts/997e5cd6-277b-4b52-b9bd-ef63de18a28e \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Blog Post Title","content":"This content has been updated. Express makes updating API resources easy!","published":false}' \
  -s | jq
```

The response should show the post with its publication status changed to `false`:

```json
[output]
{
  "id": "997e5cd6-277b-4b52-b9bd-ef63de18a28e",
  "title": "Updated Blog Post Title",
  "content": "This content has been updated. Express makes updating API resources easy!",
  "published": false,
  "created_at": "2025-03-18T11:09:57.510Z",
  "updated_at": "2025-03-18T11:24:18.594Z"
}
```

Test validation by attempting to update with invalid data, such as a title that's too short:

```command
curl -X PUT http://localhost:3000/api/posts/997e5cd6-277b-4b52-b9bd-ef63de18a28e \
  -H "Content-Type: application/json" \
  -d '{"title":"Hi","content":"This content is valid but the title is too short."}' \
  -s | jq
```

You should receive a validation error similar to what you saw during post creation:

```json
[output]

{
  "errors": [
    {
      "type": "field",
      "value": "Hi",
      "msg": "Title must be between 3 and 100 characters",
      "path": "title",
      "location": "body"
    }
  ],
  "status": "Unprocessable Entity"
}
```

Now your API supports updating existing blog posts. In the next step, you'll complete the CRUD functionality by implementing the DELETE endpoint.

## Step 8 — Implementing the DELETE endpoint for removing blog posts

To complete the CRUD functionality of your blog API, the final step is to implement the DELETE endpoint for removing blog posts from the database. This will allow users to delete posts they no longer need permanently.

Update your `routes/posts.js` file to add a DELETE method:

```javascript
[label routes/posts.js]
// ... existing imports and routes

// Update a specific post
router.put('/:id', validatePostId, validatePost, async (req, res) => {
  // ... existing code
});

[highlight]
// Delete a specific post
router.delete('/:id', validatePostId, async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: `Post with ID ${req.params.id} not found` });
    }
    
    await post.destroy();
    
    // Return 204 No Content on successful deletion
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});
[/highlight]

export default router;
```

This endpoint allows users to remove a blog post from the database permanently. It follows RESTful conventions by:

1. Using the DELETE HTTP method for resource removal
2. Validating the post ID with `validatePostId` middleware
3. Finding the post to confirm it exists before attempting deletion
4. Returning a `204 No Content` status code on success, indicating the request was processed but no content is being returned
5. Providing appropriate error responses for "not found" and server error conditions

The implementation uses a `find-then-destroy` pattern, which gives us better control over error handling but requires two database operations instead of one.

Save your changes and test the DELETE endpoint. First, let's create a new post specifically for testing deletion:

```command
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Post to Delete","content":"This post will be deleted to test the DELETE endpoint."}' \
  -s | jq
```

You should receive a response with the newly created post, including its ID. Copy this ID and use it in the following command:

```command
curl -X DELETE http://localhost:3000/api/posts/PASTE_POST_ID_HERE -v
```

The `-v` (verbose) flag will show the response headers, including the status code. You should see a `204 No Content` response:

```text
[output]
* Host localhost:3000 was resolved.
* IPv6: ::1
* IPv4: 127.0.0.1
*   Trying [::1]:3000...
* Connected to localhost (::1) port 3000
> DELETE /api/posts/7cd5e61f-5b8e-4a49-bc43-63d7d3942d5f HTTP/1.1
> Host: localhost:3000
> User-Agent: curl/8.7.1
> Accept: */*
> 
* Request completely sent off
< HTTP/1.1 204 No Content
< X-Powered-By: Express
< Access-Control-Allow-Origin: *
< Date: Tue, 18 Mar 2025 11:29:28 GMT
< Connection: keep-alive
< Keep-Alive: timeout=5
< 
* Connection #0 to host localhost left intact
```

The HTTP status code 204 confirms that the post was successfully deleted. To verify further, try to fetch the deleted post:

```command
curl http://localhost:3000/api/posts/PASTE_POST_ID_HERE -s | jq
```

You should receive a 404 Not Found response:

```json
[output]
  "error": "Post with ID 7cd5e61f-5b8e-4a49-bc43-63d7d3942d5f not found"
```

Congratulations! You've implemented a complete CRUD API for blog posts using Express and Sequelize. 

## Final thoughts
In this tutorial, you built a RESTful API for blog posts using Express, Sequelize, and SQLite, following modern ES module practices. It includes structured project organization, Sequelize integration, request validation, full CRUD functionality, and proper error handling.

The Express ecosystem continues to evolve with new packages and patterns. Explore the official documentation for [Express](https://expressjs.com/), [Sequelize](https://sequelize.org/), and [express-validator](https://express-validator.github.io/docs/) to take your API development skills further.