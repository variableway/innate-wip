# Building Web APIs with Hapi.js

[Hapi.js](https://hapi.dev/) is a feature-rich Node.js framework specifically designed for building scalable web applications and APIs. 

Known for its powerful plugin system, built-in validation, caching, authentication, and comprehensive security features, Hapi.js provides developers with a solid foundation for enterprise-grade applications.

The framework emphasizes configuration over code, offering extensive built-in functionality that reduces the need for external dependencies while maintaining excellent performance and reliability.

In this comprehensive tutorial, you'll construct a complete blog API using Hapi.js alongside Mongoose for MongoDB integration. We'll explore fundamental Hapi.js concepts while building full CRUD functionality for managing blog posts, including creation, retrieval, modification, and deletion operations.

[ad-logs]

## Prerequisites

Before diving into development, ensure you have the following installed:

- Node.js installed on your machine (preferably Node.js 20 or higher)
- MongoDB running locally or access to a MongoDB cloud instance
- Basic familiarity with JavaScript, Node.js, and REST API concepts

## Step 1 — Setting up the Hapi.js project

In this section, you'll establish the project directory structure and install the required dependencies for your Hapi.js blog API.

Begin by creating a new directory for your project and navigating into it:

```command
mkdir hapijs-blog-api && cd hapijs-blog-api
```

Initialize a new Node.js project:

```command
npm init -y
```

Install Hapi.js and the essential dependencies for your project:

```command
npm install @hapi/hapi mongoose joi @hapi/boom
```

Here's what each package provides:

- `@hapi/hapi`: The core Hapi.js framework for building web servers and APIs
- [`mongoose`](https://mongoosejs.com/): An elegant MongoDB object modeling library for Node.js
- [`joi`](https://joi.dev/): A powerful data validation library that integrates seamlessly with Hapi.js
- [`@hapi/boom`](https://hapi.dev/module/boom/): HTTP-friendly error objects for consistent error handling

Update your `package.json` to enable ESM modules and add development scripts:

```json
[label package.json]
{
  "name": "hapijs-blog-api",
  "version": "1.0.0",
[highlight]
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "node --watch server.js"
  },
[/highlight]
  ...
}
```

The `"type": "module"` field enables ESM module support, while the `--watch` flag provides built-in file watching without needing external tools.

Create the initial server file with a modern ESM-based Hapi.js setup:

```javascript
[label server.js]
import Hapi from '@hapi/hapi';

const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost',
        routes: {
            cors: {
                origin: ['*'],
                headers: ['Accept', 'Content-Type'],
                additionalHeaders: ['X-Requested-With']
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return { message: 'Welcome to the Hapi.js Blog API' };
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
```

This configuration sets up a Hapi.js server running on port 3000 with CORS enabled for cross-origin requests. The basic route responds to GET requests at the root path with a welcome message.

Start your development server using Node.js built-in watch mode:

```command
npm run dev
```

You should see output confirming the server is running:

```text
[output]
> hapijs-blog-api@1.0.0 dev
> node --watch server.js

Server running on http://localhost:3000
```

Test the server using the browser of your choice by visiting `http://localhost:3000`:

![Screenshot of the browser](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/cbef8559-cf1c-40f2-947c-82def8381600/md1x =3248x1996)

If you're using Postman for testing, create a new request with these settings:

![Screenshot of Postman GET request to root endpoint](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/3b33eb32-a7c0-407d-0569-79364a12f000/lg2x =3248x1998)

The response should be:

```json
[output]
{
  "message": "Welcome to the Hapi.js Blog API"
}
```

Node.js will automatically restart the server whenever you modify your files, providing a smooth development experience without additional dependencies.

Your Hapi.js foundation is now established and operational. In the next step, you'll integrate MongoDB using Mongoose for data persistence.

## Step 2 — Configuring MongoDB with Mongoose

With your Hapi.js server running, the next phase involves setting up MongoDB connectivity using Mongoose. This will provide the data layer for storing and managing your blog posts.

First, create a structured directory layout for your application components:

```command
mkdir -p src/models src/routes src/controllers src/utils
```

Create a database configuration file:

```javascript
[label src/utils/database.js]
import mongoose from 'mongoose';

export const connectDatabase = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/hapijs-blog';
        
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB successfully');
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        process.exit(1);
    }
};

export const disconnectDatabase = async () => {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
};
```

The configuration establishes a connection to MongoDB using either an environment variable or a default local connection string. It includes proper error handling and cleanup functions.

Update your main server file to integrate the database connection:

```javascript
[label server.js]
import Hapi from '@hapi/hapi';
[highlight]
import { connectDatabase, disconnectDatabase } from './src/utils/database.js';
[/highlight]

const init = async () => {
[highlight]
    // Connect to MongoDB before starting server
    await connectDatabase();
[/highlight]

    const server = Hapi.server({
        port: 3000,
        host: 'localhost',
        routes: {
            cors: {
                origin: ['*'],
                headers: ['Accept', 'Content-Type'],
                additionalHeaders: ['X-Requested-With']
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return { message: 'Welcome to the Hapi.js Blog API' };
        }
    });

[highlight]
    // Handle graceful shutdown
    process.on('SIGINT', async () => {
        console.log('Shutting down server...');
        await server.stop();
        await disconnectDatabase();
        process.exit(0);
    });
[/highlight]

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
```

The updated server integrates database connectivity and includes graceful shutdown handling to close database connections when the server stops properly.

Restart your server to see the MongoDB connection in action:

```command
npm run dev
```

You should see output indicating successful database connection:

```text
[output]
Connected to MongoDB successfully
Server running on http://localhost:3000
```

If MongoDB isn't running locally, you'll see a connection error. Make sure MongoDB is installed and running, or update the connection string to point to your MongoDB instance.

With the database layer configured, you're ready to create data models for your blog posts in the next step.

## Step 3 — Creating the blog post model and validation schemas

Now that MongoDB is integrated, you'll define the data structure for blog posts and establish validation rules using Joi schemas. This ensures data consistency and provides automatic request validation.

Create the Mongoose model for blog posts:

```javascript
[label src/models/Post.js]
import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    published: {
        type: Boolean,
        default: true
    },
    author: {
        type: String,
        required: true,
        trim: true
    },
    tags: [{
        type: String,
        trim: true,
        lowercase: true
    }]
}, {
    timestamps: true // Adds createdAt and updatedAt automatically
});

export const Post = mongoose.model('Post', postSchema);
```

This model defines the structure for blog posts with proper validation constraints. The `timestamps: true` option automatically manages creation and update timestamps.

Next, create Joi validation schemas for request validation:

```javascript
[label src/utils/validation.js]
import Joi from 'joi';

export const createPostSchema = Joi.object({
    title: Joi.string().trim().max(200).required()
        .messages({
            'string.max': 'Title cannot exceed 200 characters',
            'any.required': 'Title is required'
        }),
    content: Joi.string().trim().required()
        .messages({
            'any.required': 'Content is required'
        }),
    published: Joi.boolean().default(true),
    author: Joi.string().trim().required()
        .messages({
            'any.required': 'Author is required'
        }),
    tags: Joi.array().items(Joi.string().trim().lowercase()).default([])
});

export const updatePostSchema = Joi.object({
    title: Joi.string().trim().max(200),
    content: Joi.string().trim(),
    published: Joi.boolean(),
    author: Joi.string().trim(),
    tags: Joi.array().items(Joi.string().trim().lowercase())
}).min(1); // At least one field must be provided

export const postParamsSchema = Joi.object({
    id: Joi.string().hex().length(24).required()
        .messages({
            'string.hex': 'Invalid post ID format',
            'string.length': 'Invalid post ID length'
        })
});
```

These schemas define validation rules for creating posts, updating posts, and validating MongoDB ObjectIds in URL parameters. The custom error messages provide clear feedback when validation fails.

Create a simple controller to handle business logic:

```javascript
[label src/controllers/postController.js]
import { Post } from '../models/Post.js';
import Boom from '@hapi/boom';

export const postController = {
    async createPost(payload) {
        try {
            const post = new Post(payload);
            await post.save();
            return post;
        } catch (error) {
            throw Boom.badImplementation('Failed to create post');
        }
    },

    async getAllPosts(query = {}) {
        try {
            const posts = await Post.find(query)
                .sort({ createdAt: -1 })
                .exec();
            return posts;
        } catch (error) {
            throw Boom.badImplementation('Failed to retrieve posts');
        }
    },

    async getPostById(id) {
        try {
            const post = await Post.findById(id);
            if (!post) {
                throw Boom.notFound('Post not found');
            }
            return post;
        } catch (error) {
            if (error.isBoom) throw error;
            throw Boom.badImplementation('Failed to retrieve post');
        }
    }
};
```

The controller separates business logic from route handling and provides consistent error handling using Boom for HTTP-friendly error responses.

With your data models and validation schemas established, you can proceed to implement the API endpoints in the next step.

## Step 4 — Creating blog posts

Now you'll implement the first API endpoint for creating new blog posts. This will demonstrate how Hapi.js handles request validation, route configuration, and response formatting.

Create the routes file for post-related endpoints:

```javascript
[label src/routes/posts.js]
import { postController } from '../controllers/postController.js';
import { createPostSchema } from '../utils/validation.js';

export const postRoutes = [
    {
        method: 'POST',
        path: '/api/posts',
        options: {
            validate: {
                payload: createPostSchema
            },
            tags: ['api', 'posts'],
            description: 'Create a new blog post'
        },
        handler: async (request, h) => {
            try {
                const post = await postController.createPost(request.payload);
                return h.response(post).code(201);
            } catch (error) {
                return error;
            }
        }
    }
];
```

This route configuration includes automatic payload validation using the Joi schema, API documentation tags, and proper HTTP status code handling for successful creation (201).

Update your main server file to register the routes:

```javascript
[label server.js]
import Hapi from '@hapi/hapi';
import { connectDatabase, disconnectDatabase } from './src/utils/database.js';
[highlight]
import { postRoutes } from './src/routes/posts.js';
[/highlight]

const init = async () => {
    await connectDatabase();

    const server = Hapi.server({
        ..
    });

[highlight]
    // Register all post routes
    server.route(postRoutes);
[/highlight]

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return { message: 'Welcome to the Hapi.js Blog API' };
        }
    });

...
```

The server now registers all post routes, making the POST endpoint available for creating blog posts.

Test the endpoint by creating a new blog post using curl:

```command
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Getting Started with Hapi.js",
    "content": "Hapi.js is a powerful Node.js framework for building scalable APIs. This post explores its key features and benefits.",
    "author": "John Developer",
    "tags": ["hapi", "nodejs", "api"]
  }'
```

For Postman testing, configure your request as shown:

![Screenshot of Postman POST request for creating a blog post](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/a9a70ea5-8757-4d02-d0dd-a7393eb00b00/lg2x =3248x1996)

You should receive a response similar to:

```json
[output]
{
  "title": "Getting Started with Hapi.js",
  "content": "Hapi.js is a powerful Node.js framework for building scalable APIs. This post explores its key features and benefits.",
  "published": true,
  "author": "John Developer",
  "tags": [
    "hapi",
    "nodejs", 
    "api"
  ],
  "_id": "687f381d1ad899147070cfd9",
  "createdAt": "2025-07-22T07:05:01.760Z",
  "updatedAt": "2025-07-22T07:05:01.760Z",
  "__v": 0
}
```

Test the validation by sending invalid data:

```command
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title": ""}'
```


You should receive a 400 Bad Request response with validation details:

```json
[output]
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Invalid request payload input"
}
```

Hapi.js automatically validates incoming requests against your Joi schemas and returns descriptive error messages when validation fails, providing excellent developer experience out of the box.

## Step 5 — Retrieving blog posts

With post creation implemented, you'll now add endpoints for retrieving blog posts. This includes listing all posts with optional filtering and fetching individual posts by their ID.

The controller methods for retrieval are already in place from Step 3. Now let's add the routes to make them accessible via HTTP endpoints.

Add the retrieval routes to your routes file:

```javascript
[label src/routes/posts.js]
import { postController } from '../controllers/postController.js';
[highlight]
import { createPostSchema, postParamsSchema } from '../utils/validation.js';
import Joi from 'joi';
[/highlight]

export const postRoutes = [
    // Previous POST route...

[highlight]
    {
        method: 'GET',
        path: '/api/posts',
        options: {
            validate: {
                query: Joi.object({
                    published: Joi.string().valid('true', 'false')
                })
            },
            tags: ['api', 'posts'],
            description: 'Get all blog posts with optional filtering'
        },
        handler: async (request, h) => {
            try {
                const posts = await postController.getAllPosts(request.query);
                return posts;
            } catch (error) {
                return error;
            }
        }
    },

    {
        method: 'GET',
        path: '/api/posts/{id}',
        options: {
            validate: {
                params: postParamsSchema
            },
            tags: ['api', 'posts'],
            description: 'Get a specific blog post by ID'
        },
        handler: async (request, h) => {
            try {
                const post = await postController.getPostById(request.params.id);
                return post;
            } catch (error) {
                return error;
            }
        }
    }
[/highlight]
];
```

These routes provide comprehensive retrieval functionality with query parameter validation for filtering and path parameter validation for individual post lookups.

Test retrieving all posts using curl:

```command
curl http://localhost:3000/api/posts
```

For Postman, create a GET request:

![Screenshot of Postman GET request for all posts](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/6dae41f1-6c08-42f5-8307-0561c6105000/public =3248x1996)

You should receive an array of all blog posts:

```json
[output]
[
  {
    "_id": "687f388c1ad899147070cfdb",
    "title": "Getting Started with Hapi.js",
    "content": "Hapi.js is a powerful Node.js framework for building scalable APIs. This post explores its key features and benefits.",
    "published": true,
    "author": "John Developer",
    "tags": [
      "hapi",
      "nodejs",
      "api"
    ],
    "createdAt": "2025-07-22T07:06:52.222Z",
    "updatedAt": "2025-07-22T07:06:52.222Z",
    "__v": 0
  },
  ...
]
```

Test filtering by published status:

```command
curl "http://localhost:3000/api/posts?published=true"
```

Test retrieving a specific post by ID (replace with an actual ID):

```command
curl http://localhost:3000/api/posts/687f381d1ad899147070cfd9
```

For Postman, use the individual post endpoint:

![Screenshot of Postman GET request for individual post](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/0b4306ea-d9b0-4fd7-07bf-52f9b1529700/public =3248x1996)

Test error handling with an invalid ID:

```command
curl http://localhost:3000/api/posts/invalid-id
```

You should receive a 400 Bad Request response:

```json
[output]
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Invalid request params input"
}
```

Your API now supports comprehensive post retrieval with filtering capabilities and robust error handling.

## Step 6 — Updating blog posts

Next, you'll implement the functionality to update existing blog posts. This endpoint will support partial updates, allowing clients to modify only specific fields without affecting others.

Add the update method to your controller:

```javascript
[label src/controllers/postController.js]
import { Post } from '../models/Post.js';
import Boom from '@hapi/boom';

export const postController = {
    // Previous methods...

[highlight]
    async updatePost(id, payload) {
        try {
            const post = await Post.findByIdAndUpdate(
                id,
                payload,
                { new: true, runValidators: true }
            );
            
            if (!post) {
                throw Boom.notFound('Post not found');
            }
            
            return post;
        } catch (error) {
            if (error.isBoom) throw error;
            if (error.name === 'CastError') {
                throw Boom.badRequest('Invalid post ID format');
            }
            if (error.name === 'ValidationError') {
                throw Boom.badRequest(error.message);
            }
            throw Boom.badImplementation('Failed to update post');
        }
    }
[/highlight]
};
```

The update method uses `findByIdAndUpdate` with validation enabled and returns the updated document. It handles various error conditions including validation failures and invalid IDs.

Add the PUT route to your routes file:

```javascript
[label src/routes/posts.js]
import { postController } from '../controllers/postController.js';
[highlight]
import { 
    createPostSchema, 
    updatePostSchema, 
    postParamsSchema 
} from '../utils/validation.js';
[/highlight]
import Joi from 'joi';

export const postRoutes = [
    // Previous routes...

[highlight]
    {
        method: 'PUT',
        path: '/api/posts/{id}',
        options: {
            validate: {
                params: postParamsSchema,
                payload: updatePostSchema
            },
            tags: ['api', 'posts'],
            description: 'Update a specific blog post'
        },
        handler: async (request, h) => {
            try {
                const post = await postController.updatePost(
                    request.params.id, 
                    request.payload
                );
                return post;
            } catch (error) {
                return error;
            }
        }
    }
[/highlight]
];
```

The PUT route validates both the post ID parameter and the update payload, making sure only valid data can be processed.

Test updating a blog post using curl (replace with an actual post ID):

```command
curl -X PUT http://localhost:3000/api/posts/687f381d1ad899147070cfd9 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Advanced Hapi.js Features",
    "content": "This updated post covers advanced Hapi.js features including plugins, caching, and authentication."
  }'
```

You should receive the updated post:

```json
[output]
{
  "_id": "687f381d1ad899147070cfd9",
  "title": "Advanced Hapi.js Features",
  "content": "This updated post covers advanced Hapi.js features including plugins, caching, and authentication.",
  "published": true,
  "author": "John Developer",
  "tags": [
    "hapi",
    "nodejs",
    "api"
  ],
  "createdAt": "2025-07-22T07:05:01.760Z",
  "updatedAt": "2025-07-22T07:26:06.618Z",
  "__v": 0
}
```

Notice that the `updatedAt` timestamp reflects the modification time while `createdAt` remains unchanged.

Test partial updates by modifying only the published status:

```command
curl -X PUT http://localhost:3000/api/posts/687f381d1ad899147070cfd9 \
  -H "Content-Type: application/json" \
  -d '{"published": false}'
```


The response should show only the `published` field changed while other fields remain intact:

```text
[output]
{
  "_id": "687f381d1ad899147070cfd9",
  "title": "Advanced Hapi.js Features",
  "content": "This updated post covers advanced Hapi.js features including plugins, caching, and authentication.",
[highlight]
  "published": false,
[/highlight]
  "author": "John Developer",
  ...
```
That takes care of updating posts.

## Step 7 — Deleting blog posts

The final step in completing your CRUD functionality is implementing the delete endpoint. This will allow users to remove blog posts from the database when they're no longer needed.

Add the delete method to your controller:

```javascript
[label src/controllers/postController.js]
import { Post } from '../models/Post.js';
import Boom from '@hapi/boom';

export const postController = {
    // Previous methods...

[highlight]
    async deletePost(id) {
        try {
            const post = await Post.findByIdAndDelete(id);
            
            if (!post) {
                throw Boom.notFound('Post not found');
            }
            
            return { message: 'Post deleted successfully', deletedPost: post };
        } catch (error) {
            if (error.isBoom) throw error;
            if (error.name === 'CastError') {
                throw Boom.badRequest('Invalid post ID format');
            }
            throw Boom.badImplementation('Failed to delete post');
        }
    }
[/highlight]
};
```

The delete method removes the post from the database and returns a confirmation message along with the deleted post data for reference.

Add the DELETE route to your routes file:

```javascript
[label src/routes/posts.js]
export const postRoutes = [
    // Previous routes...

[highlight]
    {
        method: 'DELETE',
        path: '/api/posts/{id}',
        options: {
            validate: {
                params: postParamsSchema
            },
            tags: ['api', 'posts'],
            description: 'Delete a specific blog post'
        },
        handler: async (request, h) => {
            try {
                const result = await postController.deletePost(request.params.id);
                return h.response(result).code(200);
            } catch (error) {
                return error;
            }
        }
    }
[/highlight]
];
```

The DELETE route validates the post ID parameter and returns a 200 status code upon successful deletion.

Test the delete functionality by first creating a post specifically for deletion:

```command
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Post to Delete",
    "content": "This post will be deleted to test the DELETE endpoint.",
    "author": "Test Author",
    "tags": ["test"]
  }'
```

Note the ID from the response, then delete the post:

```command
curl -X DELETE http://localhost:3000/api/posts/687f3c4a1ad899147070cfde
```

You should receive a confirmation response:

```json
[output]
{
  "message": "Post deleted successfully",
  "deletedPost": {
    "_id": "687f3f4a39f28d32871cd0bd",
    "title": "Post to Delete",
    "content": "This post will be deleted to test the DELETE endpoint.",
    "published": true,
    "author": "Test Author",
    "tags": [
      "test"
    ],
    "createdAt": "2025-07-22T07:35:38.338Z",
    "updatedAt": "2025-07-22T07:35:38.338Z",
    "__v": 0
  }
}
```

Verify the deletion by attempting to retrieve the same post:

```command
curl http://localhost:3000/api/posts/687f3f4a39f28d32871cd0bd
```

You should receive a 404 Not Found response:

```json
[output]
{
  "statusCode": 404,
  "error": "Not Found",
  "message": "Post not found"
}
```

Your Hapi.js blog API now supports complete CRUD functionality with comprehensive error handling and validation.

## Final thoughts

You've successfully built a fully functional RESTful blog API using Hapi.js and MongoDB. Your API now supports all CRUD operations: creating, reading, updating, and deleting blog posts with proper validation, error handling, and response formatting.

To further enhance your blog API, consider implementing user authentication with JWT tokens, adding pagination for large result sets, implementing full-text search capabilities, adding rate limiting for API protection, integrating automated testing with Jest or Lab, and implementing API documentation with Swagger integration.

For continued learning and exploring advanced Hapi.js capabilities, visit the [official Hapi.js documentation](https://hapi.dev/api/) and explore the extensive ecosystem of plugins available for extending your applications.