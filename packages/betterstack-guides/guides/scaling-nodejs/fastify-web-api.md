# Building Web APIs with Fastify: A Beginner's Guide

[Fastify](https://www.fastify.io/) is a high-performance web framework for Node.js, designed with speed and low overhead in mind. It offers an intuitive plugin architecture and solid schema validation, making it especially useful for API development, where performance and developer experience are essential.

This guide will walk you through building a full-featured blog API with Fastify and Prisma ORM with SQLite. You'll learn how the Fastify ecosystem approaches routing, data validation, database integration, and error handling.

[ad-logs]

## Prerequisites

To follow this guide, you should have:

- Node.js installed on your system (preferably the latest LTS version, Node.js 22.x or higher)
- A basic understanding of JavaScript, Node.js, and web development concepts


## Step 1 — Setting up the Fastify project

Before diving into building your API, it’s essential to start with a solid foundation. A well-structured project keeps your code organized, easy to maintain, and scalable as your application grows.

To begin, create a dedicated project folder and move into it:

```command
mkdir fastify-blog-api && cd fastify-blog-api
```

Initialize the Node.js project using npm’s default settings to generate a basic `package.json` file:

```command
npm init -y
```

Now, configure your project to use ES modules:

```command
npm pkg set type="module"
```

Then, install the core dependencies required for your API:

```command
npm install fastify @prisma/client fastify-cors pino-pretty @fastify/env uuid
```

Here's a brief overview of each dependency and its role in your API architecture:

- [`fastify`](https://www.fastify.io/) – A high-performance web framework with a focus on efficiency and developer experience.
- [`@prisma/client`](https://www.prisma.io/) – A type-safe database client that simplifies database interactions through a modern query API.
- [`@fastify/cors`](https://github.com/fastify/fastify-cors) – A plugin enabling Cross-Origin Resource Sharing (CORS), allowing secure API access from different origins.
- [`pino-pretty`](https://github.com/pinojs/pino-pretty) – A formatter for Fastify's built-in logger that makes development logs more readable.
- [`@fastify/env`](https://github.com/fastify/fastify-env) – A plugin for loading and validating environment variables.
- [`uuid`](https://github.com/uuidjs/uuid) – A utility to generate universally unique identifiers for database records.

Now, install Prisma as a development dependency to manage your database schema and migrations:

```command
npm install -D prisma
```

Next, create your main application file, `app.js`. This file initializes your Fastify server and sets up essential plugins:

```javascript
[label app.js]
import Fastify from 'fastify';
import cors from '@fastify/cors';

// Create Fastify instance
const fastify = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname'
      }
    }
  }
});

// Register plugins
fastify.register(cors);

// Root route
fastify.get('/', async (request, reply) => {
  return { message: 'Welcome to the Blog API' };
});

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
```

This initialization sets up your Fastify application, beginning with importing key dependencies. It then creates a Fastify instance with pretty-printed logging for a better development experience. The CORS plugin is registered to enable cross-origin requests, and a simple root route is defined to verify that the API is functioning correctly.

The `start` function launches the server using `async/await` syntax, with proper error handling to exit gracefully if startup fails.

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

> fastify-blog-api@1.0.0 start
> node --watch app.js

(node:33210) ExperimentalWarning: Watch mode is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
[11:34:44 UTC] INFO: Server listening at http://127.0.0.1:3000
[11:34:44 UTC] INFO: Server listening at http://192.168.1.167:3000
```

This indicates your Fastify server is active. To test it, open `http://localhost:3000/` in your browser, which should display the welcome message as a JSON response:

![Screenshot of the browser showing the welcome message](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/0e0c52fa-6744-4031-aa2c-cd19522c9200/lg2x =3248x1994)

At this point, your Fastify API is set up and running. In the next step, you'll integrate a Prisma database with SQLite.


## Step 2 — Configuring the database with Prisma

Now that your Fastify server is running, you must set up Prisma with SQLite for database management. This will allow you to define your data model and create database operations in a type-safe way.

First, initialize Prisma in your project:

```command
npx prisma init
```

This command creates:

- A `prisma` directory with a `schema.prisma` file to define your database schema
- A `.env` file in the project root to store environment variables

Upon running the command, you will see output similar to the following:

```text
[output]

✔ Your Prisma schema was created at prisma/schema.prisma
  You can now open it in your favorite editor.

Next steps:
1. Set the DATABASE_URL in the .env file to point to your existing database. If your database has no tables yet, read https://pris.ly/d/getting-started
2. Set the provider of the datasource block in schema.prisma to match your database: postgresql, mysql, sqlite, sqlserver, mongodb or cockroachdb.
3. Run prisma db pull to turn your database schema into a Prisma schema.
4. Run prisma generate to generate the Prisma Client. You can then start querying your database.
5. Tip: Explore how you can extend the ORM with scalable connection pooling, global caching, and real-time database events. Read: https://pris.ly/cli/beyond-orm

More information in our documentation:
https://pris.ly/d/getting-started
```
The output confirms that Prisma has successfully created the `schema.prisma` file and guides you through configuring your database connection, pulling the schema, and generating the Prisma Client.


Next, update the generated `schema.prisma` file to use SQLite and define a blog post model:

```prisma
[label prisma/schema.prisma]
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
[highlight]
  provider = "sqlite"
[/highlight]
  url      = env("DATABASE_URL")
}

[highlight]
model Post {
  id        String   @id @default(uuid())
  title     String
  content   String
  published Boolean  @default(true)
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("posts")
}
[/highlight]
```

Now update the generated `.env` file to set the database URL:

```env
[label .env]
DATABASE_URL="file:../data/blog.db"
```

Create a `data` directory to store your SQLite database file:

```command
mkdir -p data
```

Generate the Prisma client:

```command
npx prisma generate
```
```text
[output]
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma

✔ Generated Prisma Client (v6.5.0) to ./node_modules/@prisma/client in 54ms
```

Then, create your database schema:

```command
npx prisma db push
```

The output will look similar to this:

```text
[output]
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": SQLite database "blog.db" at "file:../data/blog.db"

SQLite database blog.db created at file:../data/blog.db

🚀  Your database is now in sync with your Prisma schema. Done in 14ms

✔ Generated Prisma Client (v6.5.0) to ./node_modules/@prisma/client in
 70ms
```
The output confirms that Prisma has successfully loaded the environment variables, set up the SQLite database, synced it with the schema, and generated the Prisma Client.

Next, create a utility module for database access. First, create the directory in your project's root directory:

```command
mkdir -p utils
```

Then create `utils/db.js` with the following contents:

```javascript
[label utils/db.js]
import { PrismaClient } from '@prisma/client';

// Create a singleton Prisma client instance
const prisma = new PrismaClient();

// Test the database connection
async function testConnection() {
  try {
    await prisma.$connect();
    console.log('Database connection established successfully.');
    return true;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return false;
  }
}

export { prisma, testConnection };
```

Finally, update your `app.js` file to import and initialize the database connection:

```javascript
[label app.js]
import Fastify from 'fastify';
import cors from '@fastify/cors';
[highlight]
import { testConnection } from './utils/db.js';
[/highlight]

....
// Start server
const start = async () => {
  try {
[highlight]
    // Test database connection before starting the server
    const dbConnected = await testConnection();
    if (!dbConnected) {
      throw new Error('Failed to connect to the database');
    }
[/highlight]
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
```

Once you've completed these steps, save the changes, and your server will auto-restart. You should see a message confirming the database connection was established successfully.

```text
[output]
Restarting 'app.js'
Database connection established successfully.
[11:54:59 UTC] INFO: Server listening at http://127.0.0.1:3000
[11:54:59 UTC] INFO: Server listening at http://192.168.1.167:3000
```
This setup creates a foundation for your API, with Prisma managing the SQLite database. In the next step, you'll define validation schemas and implement CRUD operations for blog posts.


## Step 3 — Setting up schema validation with Fastify

A key feature of Fastify is its built-in schema validation, which uses JSON Schema to validate requests and responses without external libraries. This improves data integrity and keeps performance high.

Let's create a directory to organize your validation schemas:

```command
mkdir -p schemas
```

Now, create a file called `schemas/post.js`. First, let's define a base schema that represents the structure of a blog post:

```javascript
[label schemas/post.js]
// Schema for post objects returned in responses
const postSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    title: { type: 'string' },
    content: { type: 'string' },
    published: { type: 'boolean' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' }
  }
};
```

This `postSchema` defines what a post object looks like in your API. It specifies that a post has an ID (which should be a UUID), a title and content (both strings), a published flag (boolean), and creation and update timestamps.

Next, add a schema for creating new posts. This will validate POST requests to your API:

```javascript
[label schemas/post.js]
// Schema for post objects returned in responses
const postSchema = {
  // ... previous code
};

[highlight]
// Schema for creating a new post
const createPostSchema = {
  body: {
    type: 'object',
    required: ['title', 'content'],
    properties: {
      title: { 
        type: 'string', 
        minLength: 3, 
        maxLength: 100 
      },
      content: { 
        type: 'string', 
        minLength: 10 
      },
      published: { 
        type: 'boolean',
        default: true
      }
    },
    additionalProperties: false
  },
  response: {
    201: postSchema
  }
};
[/highlight]
```

The `createPostSchema` validates request bodies for post creation. It requires a title (between 3-100 characters) and content (at least 10 characters), with an optional published flag. The `additionalProperties: false` ensures no unexpected fields are included. The response schema specifies that a successful creation (status 201) should return a post object.

Now, add a schema to validate GET requests for retrieving multiple posts:

```javascript
[label schemas/post.js]
// Previous schemas...

// Schema for getting all posts
const getAllPostsSchema = {
  querystring: {
    type: 'object',
    properties: {
      published: { type: 'boolean' }
    }
  },
  response: {
    200: {
      type: 'array',
      items: postSchema
    }
  }
};
```

This schema validates query parameters (allowing filtering by published status) and ensures the response is an array of post objects.

Next, add a schema for retrieving a single post by its ID:

```javascript
[label schemas/post.js]
// Previous schemas...

// Schema for getting a single post
const getPostSchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string', format: 'uuid' }
    }
  },
  response: {
    200: postSchema,
    404: {
      type: 'object',
      properties: {
        error: { type: 'string' }
      }
    }
  }
};
```

The `getPostSchema` validates the ID route parameter, ensuring it's a valid UUID. It also defines response formats for both success (returning a post) and not found errors.

For updating posts, add a schema that validates both the ID parameter and the request body:

```javascript
[label schemas/post.js]
// Previous schemas...

// Schema for updating a post
const updatePostSchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string', format: 'uuid' }
    }
  },
  body: {
    type: 'object',
    required: ['title', 'content'],
    properties: {
      title: { 
        type: 'string', 
        minLength: 3, 
        maxLength: 100 
      },
      content: { 
        type: 'string', 
        minLength: 10 
      },
      published: { 
        type: 'boolean' 
      }
    },
    additionalProperties: false
  },
  response: {
    200: postSchema,
    404: {
      type: 'object',
      properties: {
        error: { type: 'string' }
      }
    }
  }
};
```

Finally, add a schema for deleting posts:

```javascript
[label schemas/post.js]
// Previous schemas...

// Schema for deleting a post
const deletePostSchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string', format: 'uuid' }
    }
  },
  response: {
    204: {
      type: 'null'
    },
    404: {
      type: 'object',
      properties: {
        error: { type: 'string' }
      }
    }
  }
};
```

The `deletePostSchema` validates the ID parameter and defines response formats for successful deletion (204 No Content) and not found errors.

Finally, don't forget to export all schemas so they can be imported into your route files:

```javascript
[label schemas/post.js]
// Previous schemas...

export {
  createPostSchema,
  getAllPostsSchema,
  getPostSchema,
  updatePostSchema,
  deletePostSchema
};
```

When these schemas are attached to routes, Fastify automatically validates incoming requests before they reach your handlers. If validation fails, Fastify rejects the request with a detailed error message. For example, if someone tries to create a post with a title that's too short, they'll receive an error response.


With your validation schemas defined, you're ready to implement the API routes in the next step.


## Step 4 — Creating blog posts

With your database configured and validation schemas in place, it's time to create the API endpoints that will power your blog application. In Fastify, routes are typically organized using plugins, making your code modular and maintainable.

First, create a `routes` directory in your project root:

```command
mkdir -p routes
```

Next, create a file called `routes/posts.js` to implement the blog post endpoints. This file will export a Fastify plugin that registers all your post-related routes:

```javascript
[label routes/posts.js]
import { prisma } from '../utils/db.js';
import {
  createPostSchema,
  getAllPostsSchema,
  getPostSchema,
  updatePostSchema,
  deletePostSchema
} from '../schemas/post.js';

// Define the posts routes plugin
async function postRoutes(fastify, options) {
  // Create a new post
  fastify.post('/', { schema: createPostSchema }, async (request, reply) => {
    try {
      const { title, content, published = true } = request.body;
      
      const post = await prisma.post.create({
        data: {
          title,
          content,
          published
        }
      });
      
      reply.code(201).send(post);
    } catch (error) {
      request.log.error('Error creating post:', error);
      reply.code(500).send({ error: 'Failed to create post' });
    }
  });
}

export default postRoutes;
```

This implementation creates a Fastify plugin that registers a single POST route for now. The route handler uses the Prisma client to insert a new post record into the database and returns the created post with a 201 status code.

The `schema` option applies the `createPostSchema` you defined earlier, which validates the request body before the handler runs. This ensures that only valid data reaches your database operations.

Now update your `app.js` file to register this routes plugin:

```javascript
[label app.js]
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { testConnection } from './utils/db.js';
[highlight]
import postRoutes from './routes/posts.js';
[/highlight]

...
// Register plugins
fastify.register(cors);

[highlight]
// Register route plugins
fastify.register(postRoutes, { prefix: '/api/posts' });
[/highlight]

// Root route
fastify.get('/', async (request, reply) => {
  return { message: 'Welcome to the Blog API' };
});

// Start server
const start = async () => {
  ...
};

start();
```

The `fastify.register(postRoutes, { prefix: '/api/posts' })` line registers your posts routes plugin with a prefix of `/api/posts`. This means the POST route you defined will be accessible at `/api/posts`.

Save your changes and test the endpoint by creating a new blog post using `curl`:

```command
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"My First Blog Post","content":"This is the content of my first blog post. Fastify makes API development fast and enjoyable!"}' \
  -s | jq
```

You should receive a response like this:

```json
[output]
{
  "id": "600be861-a0d4-4d4e-9897-b40f50c1452f",
  "title": "My First Blog Post",
  "content": "This is the content of my first blog post. Fastify makes API development fast and enjoyable!",
  "published": true,
  "createdAt": "2025-03-19T12:16:08.265Z",
  "updatedAt": "2025-03-19T12:16:08.265Z"
}
```

Test the validation by trying to create a post with a title that's too short:

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
  "statusCode": 400,
  "code": "FST_ERR_VALIDATION",
  "error": "Bad Request",
  "message": "body/title must NOT have fewer than 3 characters"
}
```

This confirms that Fastify's schema validation is working correctly. The validation runs before your route handler, so invalid requests never reach your database code.

Now, you've implemented the first endpoint of your blog API, allowing users to create new posts. In the next step, you'll add the GET endpoints to retrieve posts from the database.


## Step 5 — Retrieving blog posts

Now that you can create blog posts, let's implement functionality to retrieve them. We'll start with an endpoint to fetch all posts, then add another endpoint to get a specific post by its ID.

First, let's update your `routes/posts.js` file to add a GET method for retrieving all posts:

```javascript
[label routes/posts.js]
import { prisma } from '../utils/db.js';
import {
  createPostSchema,
  getAllPostsSchema,
  getPostSchema,
  updatePostSchema,
  deletePostSchema
} from '../schemas/post.js';

// Define the posts routes plugin
async function postRoutes(fastify, options) {
  // Create a new post
  fastify.post('/', { schema: createPostSchema }, async (request, reply) => {
    // ... existing code
  });

[highlight]
  // Get all posts with optional filtering
  fastify.get('/', { schema: getAllPostsSchema }, async (request, reply) => {
    try {
      const where = {};
      
      // Add published filter if provided
      if (request.query.published !== undefined) {
        where.published = request.query.published;
      }
      
      const posts = await prisma.post.findMany({
        where,
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      return posts;
    } catch (error) {
      request.log.error('Error fetching posts:', error);
      reply.code(500).send({ error: 'Failed to fetch posts' });
    }
  });
[/highlight]
}

export default postRoutes;
```

This endpoint retrieves multiple posts with optional filtering. It uses Prisma's `findMany` method to query the database and supports a query parameter to filter by published status. The posts are sorted by creation date, with the newest first.

The `schema` option applies the `getAllPostsSchema` you defined earlier, which validates the query parameters before executing the database query.

Save your changes and test retrieving all posts:

```command
curl http://localhost:3000/api/posts -s | jq
```

You should see all the posts you've created so far:

```json
[output]
[
  {
    "id": "600be861-a0d4-4d4e-9897-b40f50c1452f",
    "title": "My First Blog Post",
    "content": "This is the content of my first blog post. Fastify makes API development fast and enjoyable!",
    "published": true,
    "createdAt": "2025-03-19T12:16:08.265Z",
    "updatedAt": "2025-03-19T12:16:08.265Z"
  }
]
```

You can also test filtering posts by their publication status:

```command
curl "http://localhost:3000/api/posts?published=false" -s | jq
```

This should return only unpublished posts (which is an empty array since all your posts are published):

```text
[output]
[]
```

Now that you've implemented and tested the endpoint for retrieving all posts let's add another endpoint to fetch a single post by its ID. Update your `routes/posts.js` file again:

```javascript
[label routes/posts.js]
import { prisma } from '../utils/db.js';
import {
  createPostSchema,
  getAllPostsSchema,
  getPostSchema,
  updatePostSchema,
  deletePostSchema
} from '../schemas/post.js';

// Define the posts routes plugin
async function postRoutes(fastify, options) {
  // Create a new post
  fastify.post('/', { schema: createPostSchema }, async (request, reply) => {
    // ... existing code
  });

  // Get all posts with optional filtering
  fastify.get('/', { schema: getAllPostsSchema }, async (request, reply) => {
    // ... existing code
  });

[highlight]
  // Get a specific post by ID
  fastify.get('/:id', { schema: getPostSchema }, async (request, reply) => {
    try {
      const post = await prisma.post.findUnique({
        where: { id: request.params.id }
      });
      
      if (!post) {
        reply.code(404).send({ 
          error: `Post with ID ${request.params.id} not found` 
        });
        return;
      }
      
      return post;
    } catch (error) {
      request.log.error('Error fetching post:', error);
      reply.code(500).send({ error: 'Failed to fetch post' });
    }
  });
[/highlight]
}

export default postRoutes;
```

This new endpoint retrieves a single post by its ID. It uses Prisma's `findUnique` method for an efficient primary key lookup. If no post is found, it returns a 404 Not Found response.

The `schema` option applies the `getPostSchema` you defined earlier, which validates that the ID is a valid UUID before attempting to retrieve the post.

Save your changes and test retrieving a single post by its ID (replace with an actual ID from your database):

```command
curl http://localhost:3000/api/posts/PASTE_YOUR_POST_ID_HERE -s | jq
```

You should receive the specific post:

```json
[output]
{
  "id": "600be861-a0d4-4d4e-9897-b40f50c1452f",
  "title": "My First Blog Post",
  "content": "This is the content of my first blog post. Fastify makes API development fast and enjoyable!",
  "published": true,
  "createdAt": "2025-03-19T12:16:08.265Z",
  "updatedAt": "2025-03-19T12:16:08.265Z"
}
```

Try requesting a non-existent post to see the error handling:

```command
curl http://localhost:3000/api/posts/00000000-0000-0000-0000-000000000000 -s | jq
```

You should receive a validation error because the provided ID doesn't match the UUID format:

```json
[output]

{
  "error": "Post with ID 00000000-0000-0000-0000-000000000000 not found"
}
```

With these GET endpoints implemented, your API supports creating and retrieving blog posts. Next, you'll implement the PUT endpoint to update existing posts.


## Step 6 — Updating blog posts

After implementing creation and retrieval functionality, you'll now add the ability to update existing posts. In RESTful design, `PUT` requests replace the entire resource, allowing changes to the title, content, or publication status.

Let's update your `routes/posts.js` file to add a PUT method for updating posts:

```javascript
[label routes/posts.js]
import { prisma } from '../utils/db.js';
import {
  createPostSchema,
  getAllPostsSchema,
  getPostSchema,
  updatePostSchema,
  deletePostSchema
} from '../schemas/post.js';

// Define the posts routes plugin
async function postRoutes(fastify, options) {
  // Create a new post
  fastify.post('/', { schema: createPostSchema }, async (request, reply) => {
    // ... existing code
  });

  // Get all posts with optional filtering
  fastify.get('/', { schema: getAllPostsSchema }, async (request, reply) => {
    // ... existing code
  });

  // Get a specific post by ID
  fastify.get('/:id', { schema: getPostSchema }, async (request, reply) => {
    // ... existing code
  });

[highlight]
  // Update a specific post
  fastify.put('/:id', { schema: updatePostSchema }, async (request, reply) => {
    try {
      const { id } = request.params;
      const { title, content, published } = request.body;
      
      // First check if the post exists
      const existingPost = await prisma.post.findUnique({
        where: { id }
      });
      
      if (!existingPost) {
        reply.code(404).send({ error: `Post with ID ${id} not found` });
        return;
      }
      
      // Update the post
      const post = await prisma.post.update({
        where: { id },
        data: {
          title,
          content,
          published: published !== undefined ? published : existingPost.published
        }
      });
      
      return post;
    } catch (error) {
      request.log.error('Error updating post:', error);
      reply.code(500).send({ error: 'Failed to update post' });
    }
  });
[/highlight]
}

export default postRoutes;
```

This PUT endpoint uses the `updatePostSchema` to validate both the URL parameter and the request body. The handler follows a two-step process:

1. First, it verifies that the post exists using `findUnique`
2. Then it updates the post with the new data using Prisma's `update` method

The implementation preserves the published status if it's not included in the request, which allows for partial updates. This approach ensures that the post exists before attempting to update it, providing better error handling for API consumers.

Save your changes and test the endpoint by updating one of the posts you created earlier. Replace the ID in the URL with an actual ID from your database:

```command
curl -X PUT http://localhost:3000/api/posts/PASTE_YOUR_POST_ID_HERE \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Blog Post Title","content":"This content has been updated. Fastify makes updating API resources easy!"}' \
  -s | jq
```

You should receive a response with the updated post:

```json
[output]
{
  "id": "600be861-a0d4-4d4e-9897-b40f50c1452f",
  "title": "Updated Blog Post Title",
  "content": "This content has been updated. Fastify makes updating API resources easy!",
  "published": true,
  "createdAt": "2025-03-19T12:16:08.265Z",
  "updatedAt": "2025-03-19T12:30:02.243Z"
}
```

Notice that while the `createdAt` timestamp remains the same, the `updatedAt` timestamp has been updated to reflect the modification time.

You can also try updating the publication status of a post. This is useful for changing a draft post to published or vice versa:

```command
curl -X PUT http://localhost:3000/api/posts/PASTE_YOUR_POST_ID_HERE \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Blog Post Title","content":"This content has been updated. Fastify makes updating API resources easy!","published":false}' \
  -s | jq
```

The response should show the post with its publication status changed to `false`:

```json
[output]
{
  "id": "600be861-a0d4-4d4e-9897-b40f50c1452f",
  "title": "Updated Blog Post Title",
  "content": "This content has been updated. Fastify makes updating API resources easy!",
  "published": false,
  "createdAt": "2025-03-19T12:16:08.265Z",
  "updatedAt": "2025-03-19T12:39:45.103Z"
}
```

Test validation by attempting to update with invalid data, such as a title that's too short:

```command
curl -X PUT http://localhost:3000/api/posts/PASTE_YOUR_POST_ID_HERE \
  -H "Content-Type: application/json" \
  -d '{"title":"Hi","content":"This content is valid but the title is too short."}' \
  -s | jq
```

You should receive a validation error:

```json
[output]

  "statusCode": 400,
  "code": "FST_ERR_VALIDATION",
  "error": "Bad Request",
  "message": "body/title must NOT have fewer than 3 characters"
}
```

With the PUT endpoint implemented, your API now supports updating existing blog posts. In the next step, you'll complete the CRUD functionality by implementing the DELETE endpoint.


## Step 7 — Removing blog posts

The final step in completing the CRUD functionality of your blog API is to implement the DELETE endpoint. This will allow users to remove posts they no longer need from the database permanently.

Let's update your `routes/posts.js` file to add a DELETE method:

```javascript
[label routes/posts.js]
import { prisma } from '../utils/db.js';
import {
  createPostSchema,
  getAllPostsSchema,
  getPostSchema,
  updatePostSchema,
  deletePostSchema
} from '../schemas/post.js';

// Define the posts routes plugin
async function postRoutes(fastify, options) {
  // Create a new post
  fastify.post('/', { schema: createPostSchema }, async (request, reply) => {
    // ... existing code
  });

  ...
  // Update a specific post
  fastify.put('/:id', { schema: updatePostSchema }, async (request, reply) => {
    // ... existing code
  });

[highlight]
  // Delete a specific post
  fastify.delete('/:id', { schema: deletePostSchema }, async (request, reply) => {
    try {
      const { id } = request.params;
      
      // First check if the post exists
      const existingPost = await prisma.post.findUnique({
        where: { id }
      });
      
      if (!existingPost) {
        reply.code(404).send({ error: `Post with ID ${id} not found` });
        return;
      }
      
      // Delete the post
      await prisma.post.delete({
        where: { id }
      });
      
      // Return 204 No Content on successful deletion
      reply.code(204).send();
    } catch (error) {
      request.log.error('Error deleting post:', error);
      reply.code(500).send({ error: 'Failed to delete post' });
    }
  });
[/highlight]
}

export default postRoutes;
```

This endpoint allows users to remove a blog post from the database permanently. It follows RESTful conventions by:

1. Using the DELETE HTTP method for resource removal
2. Validating the post ID with the `deletePostSchema`
3. Checking if the post exists before attempting to delete it
4. Returning a `204 No Content` status code on success, indicating the request was successful but no content is being returned
5. Providing appropriate error responses for "not found" and server error situations

The implementation uses a `find-then-delete` pattern, which gives you better control over error handling by confirming the resource exists before attempting to delete it.

Save your changes and test the DELETE endpoint. First, let's create a new post specifically for testing deletion:

```command
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Post to Delete","content":"This post will be deleted to test the DELETE endpoint."}' \
  -s | jq
```

You should receive a response with the newly created post, including its ID. Copy this ID and use it in the following command:

```command
curl -X DELETE http://localhost:3000/api/posts/PASTE_NEW_POST_ID_HERE -v
```

The `-v` (verbose) flag will show the response headers, including the status code. You should see a `204 No Content` response:

```text
[output]
 Host localhost:3000 was resolved.
* IPv6: ::1
* IPv4: 127.0.0.1
*   Trying [::1]:3000...
* connect to ::1 port 3000 from ::1 port 56374 failed: Connection refused
*   Trying 127.0.0.1:3000...
* Connected to localhost (127.0.0.1) port 3000
> DELETE /api/posts/e1d7d3df-8d62-44ef-a1a2-f629db0755ff HTTP/1.1
> Host: localhost:3000
> User-Agent: curl/8.7.1
> Accept: */*
> 
* Request completely sent off
< HTTP/1.1 204 No Content
< access-control-allow-origin: *
< Date: Wed, 19 Mar 2025 12:35:55 GMT
< Connection: keep-alive
< Keep-Alive: timeout=72
< 
* Connection #0 to host localhost left intact
```

The HTTP status code 204 confirms that the post was successfully deleted. To verify further, try to fetch the deleted post:

```command
curl http://localhost:3000/api/posts/PASTE_SAME_POST_ID_HERE -s | jq
```

You should receive a 404 Not Found response:

```json
[output]

{
  "error": "Post with ID e1d7d3df-8d62-44ef-a1a2-f629db0755ff not found"
}
```


Congratulations! You've successfully built a complete RESTful API for blog posts using Fastify and Prisma with SQLite. 



## Final thoughts
This guide showed you how to set up Fastify with Prisma to build a fast and reliable API. You’ve added JSON Schema validation, organized routes with plugins, and handled errors properly—essential steps for a production-ready project.  

As your API grows, you can add authentication, database relationships, pagination, rate limiting, and API documentation. Fastify’s design makes it an excellent choice for handling high traffic while keeping your code easy to manage.  

For more details, check out the official documentation for [Fastify](https://www.fastify.io/docs/latest/) and [Prisma](https://www.prisma.io/docs/). You might also find [Fastify’s plugin ecosystem](https://www.fastify.io/ecosystem/) helpful in adding features like authentication with [@fastify/jwt](https://github.com/fastify/fastify-jwt) or API documentation with [@fastify/swagger](https://github.com/fastify/fastify-swagger).