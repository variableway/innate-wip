# Building Node.js Apps with Fastify: A Beginner's Guide

[Fastify](https://fastify.io/) is a high-performance web framework for Node.js,
designed with a focus on speed, security, and a great developer experience.
Inspired by frameworks like Hapi and Express, Fastify offers a modular and
lightweight architecture, making it suitable for both small and large-scale
applications. It includes built-in features such as efficient logging, JSON
schema validation, and easy extensibility through a rich ecosystem of plugins,
hooks, and decorators.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/7gTj5RLyMXw?si=0HL874pVCHzEoKZE" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

In this tutorial, you'll learn how to build a blog application using Fastify
with SQLite3 as the database backend. We'll cover key Fastify concepts while
implementing core blog functionalities: creating, reading, updating, and
deleting articles.

![Screenshot of the application you will build in this tutorial](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/e28312ea-3c45-4655-01ae-0c54cc1abf00/lg2x =3018x1582)

## Prerequisites

Before you start, make sure you have:

- The latest version of [Node.js](https://nodejs.org/en/download/) and [npm](https://www.npmjs.com/get-npm) installed on your system.
- A basic understanding of building web applications with JavaScript.

## Step 1 — Understanding Fastify

Fastify is a modern web framework for Node.js, designed for speed, developer-friendliness, and robust security. Its performance excellence, marked by high throughput and low latency, is achieved through an intricately optimized HTTP layer. Fastify’s API is both concise and intuitive, catering to developers of all experience levels.

Key features of Fastify include:

- **Schema-based Validation and Serialization**: Fastify incorporates built-in, type-safe validation and data serialization using JSON Schema, ensuring reliability and high performance.
- **Extensive Plugin Ecosystem**: With over 260 plugins available, Fastify supports various tasks such as authentication, caching, and data integration. Its modular architecture also allows easy creation and integration of custom plugins.
- **Efficient Logging**: Fastify includes a highly efficient, low-overhead logger that delivers detailed insights without impacting performance.
- **Extensible Lifecycle Hooks**: Fastify offers fine-grained control over the request/response lifecycle through hooks, allowing customization of application behaviour at various stages.

The [benchmarks below](https://fastify.dev/benchmarks/) illustrate Fastify's performance compared to other popular Node.js frameworks, highlighting its capacity to handle a high number of requests per second:

![Screenshot of Fastify benchmarks](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/d07da4a8-d999-4164-529e-1fc1c721ed00/lg1x =1678x1729)

These benchmarks showcase Fastify’s superior performance, although real-world results can vary depending on specific use cases and implementation details.

## Step 2 — Setting up the project

In this section, you will set up the directory and install the necessary dependencies for the project.

To begin, clone the project [repository on Github](https://github.com/betterstack-community/fastify-blog):

```command
git clone https://github.com/betterstack-community/fastify-blog
```

Move into the directory:

```command
cd fastify-blog
```

The directory is configured to use ES modules and includes EJS templates, CSS styles, and environment variable configurations. 

Now, install the project dependencies, which include the Fastify web framework and the [env-schema](https://www.npmjs.com/package/env-schema) package for managing environment variables:

```command
npm install
```
Next, create a `.env` file with the following:

```text
[label .env]
PORT=3000
LOG_LEVEL=info
NODE_ENV=development
DB_FILE=./blog.db
```

In the directory, you'll find `src/app.js`, which contains the following:

```javascript
[label src/app.js]
import Fastify from "fastify";
import env from "./config/env.js";
import logger from "./config/logger.js";

const fastify = Fastify({
  logger: logger,
});

fastify.get("/", function handler(request, reply) {
  return { message: "Blog app demo" };
});

fastify.listen({ port: env.port }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
 }
  fastify.log.info(`Blog App is running in ${env.nodeEnv} mode at ${address}`);
});
```
In the `src/app.js` file, Fastify is imported along with environment configurations from `./config/env.js` and a custom logger from `./config/logger.js`.

A Fastify instance is created with logging enabled. A route is defined at the root URL `/` that returns a JSON message, "Blog app demo." The server is started using `fastify.listen()`, which listens on the port specified in `env.port`. 

If an error occurs during startup, it is logged, and the process exits; otherwise, a log confirms the server is running, including the environment mode and address.


To run this server, execute the following command in your terminal:

```command
npm run dev
```

The command starts the server using the `dev` script defined in your
`package.json` file. Once the server is up and running, you'll see output like
this:

```text
[output]
> fastify-guide@1.0.0 dev
> node --watch src/app.js

{"level":"info","time":"2024-08-18T10:31:46.533Z","pid":30817,"host":"MACOOKs-MBP","msg":"Server listening at http://[::1]:3000"}
{"level":"info","time":"2024-08-18T10:31:46.534Z","pid":30817,"host":"MACOOKs-MBP","msg":"Server listening at http://127.0.0.1:3000"}
{"level":"info","time":"2024-08-18T10:31:46.534Z","pid":30817,"host":"MACOOKs-MBP","msg":"Blog App is running in development mode at http://[::1]:3000"}
```

This output confirms that the Fastify server has started and is listening for
connections on both IPv6 (`http://[::1]:3000`) and IPv4
(`http://127.0.0.1:3000`). To verify everything is working, open
`http://127.0.0.1:3000` in your browser:

![Screenshot showing the server output `{"message":"Blog app demo"}` in the browser](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/fd19e199-ac2a-4db9-fae1-d01c34b83b00/md1x =2082x564)

To see how Fastify automatically handles responses, open a second terminal and run the following command:

```command
curl http://localhost:3000/ --include
```

The output will show:

```text
[output]
HTTP/1.1 200 OK
content-type: application/json; charset=utf-8
content-length: 27
...

{"message":"Blog app demo"}%
```

Fastify automatically sets the correct `Content-Type` header based on the data you return. For example, when returning a JSON object, Fastify sets the `Content-Type` to `application/json; charset=utf-8`. Unlike Express, where you typically need to explicitly set the content type with methods like `res.json()`, Fastify handles this for you.

If you modify the route to return a plain text string:

```javascript
...
fastify.get("/", function handler(request, reply) {
[highlight]
  return "Blog app demo";
[/highlight]
});
...
```

And run the `curl` command again:

```command
curl http://localhost:3000/ --include
```

The output will change to:

```text
[output]
HTTP/1.1 200 OK
content-type: text/plain; charset=utf-8
content-length: 13
Date: Sun, 18 Aug 2024 10:35:21 GMT
Connection: keep-alive
Keep-Alive: timeout=72

Blog app demo%
```

Fastify automatically adjusts the `Content-Type` header to `text/plain; charset=utf-8`, reflecting the change in response type. This automatic content negotiation simplifies your code and makes it more efficient by removing the need to manually set response headers, as you would in Express.

Next, you'll organize the code by separating it into routes and controllers. This structure will enhance maintainability and scalability, making it easier to manage and expand the application as it grows.

To begin, create the `controllers` directory:

```command
mkdir src/controllers
```

In your editor, create the `root.controller.js` file with the following content:

```javascript
[label src/controllers/root.controller.js]
export async function getRoot(request, reply) {
  return "Blog app demo";
}
```

In this file, the `getRoot()` function handles the logic for rendering the root
path of your application.

Next, create the `routes` directory within the `src` directory:

```command
mkdir src/routes
```

Now, create the `routes.js` file and add the code that follows:

```javascript
[label src/routes/routes.js]
import { getRoot } from "../controllers/root.controller.js";

export default async function routes(fastify, options) {
  fastify.get("/", getRoot);
}
```

This file defines your application's routes, linking the root path `/` to the `getRoot()` controller.

Next, return to the `app.js` file and remove the existing `fastify.get("/")` route definition since it has been moved to a dedicated routes module:

```javascript
[label src/app.js]
const fastify = Fastify({
  logger: logger,
});

// remove the following
[highlight]
fastify.get("/", function handler(request, reply) {
  return "Blog app demo";
});
[/highlight]
...
```

Now, add the following code to register the routes:

```javascript
[label src/app.js]
import Fastify from "fastify";
import env from "./config/env.js";
import logger from "./config/logger.js";
[highlight]
import routes from "./routes/routes.js";
[/highlight]

...
[highlight]
await fastify.register(routes);
[/highlight]

fastify.listen({ port: env.port }, (err, address) => {
 ...
});
```

With these changes, your code is better organized, making it easier to manage and extend. Now, refresh your browser to verify everything is working correctly:

![Screenshot of the browser response](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/71851828-1304-4431-56d3-b8a6d52b3b00/md1x =1664x564)

With the project directory now set up, you can proceed to the next steps.

## Step 3 — Creating the homepage 

In this step, you'll set up a template engine in your Fastify application. While there are [several templating engines available](https://github.com/fastify/point-of-view#fastifyview), this tutorial will focus on using EJS (Embedded JavaScript). This popular templating language allows you to embed JavaScript code within your HTML markup.

To use EJS,  install the following necessary packages:

- [`@fastify/view`](https://github.com/fastify/point-of-view): This plugin adds template rendering support to Fastify, allowing you to use various templating languages, including EJS.
- [`ejs`](https://ejs.co/): The EJS templating language itself.

Install these packages by running:

```command
npm install @fastify/view ejs
```

The starter files already include a `views` directory inside the `src` directory to store your EJS templates. The following templates are already in place:

- `layout.ejs`: Provides a uniform layout for your site, including meta tags, a title, header, and navigation. It dynamically inserts the page title and content using EJS.
- `index.ejs`:  If no posts are available, it shows a message encouraging the user to create a new post.

Here is the content of `index.ejs`:

```html
[label src/views/index.ejs]
<p>There are no blog posts yet. Why not <a href="/post/new">create one</a>?</p>
```

Update the `root.controller.js` file to render the homepage by returning the `index.ejs` template with the title "Homepage":

```javascript
[label src/controllers/root.controller.js]
export function getRoot(request, reply) {
[highlight]
  return reply.view("index", { title: "Homepage"});
[/highlight]
}
```

Next, add the highlighted code to set up the templating engine in the `src/app.js` file:

```javascript
[label src/app.js]
...
[highlight]
import path from "node:path";
import fastifyView from "@fastify/view";
import ejs from "ejs";

const __dirname = import.meta.dirname;
[/highlight]

const fastify = Fastify({
  logger: logger,
});

[highlight]
await fastify.register(fastifyView, {
  engine: {
    ejs,
  },
  root: path.join(__dirname, "views"),
  viewExt: "ejs",
  layout: "layout.ejs",
});
[/highlight]

await fastify.register(routes);
...
```

In this code, you register the `@fastify/view` plugin, configure EJS as the template engine, specify the `views` directory, and set `layout.ejs` as the default layout. The root route handler now renders `index.ejs` with `reply.view()`, and the `.ejs` extension is managed automatically.

After saving your changes, refresh `http://127.0.0.1:3000/` to see the rendered template:

![Screenshot of rendered template](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/344dcb4d-9382-411a-e437-fab7b61fd300/lg2x =2078x996)

With the templates configured, the next step is to style the page.

## Step 4 — Serving static files in Fastify

The `layout.ejs` file references a `styles.css` file inside the `public` directory, but it won't be served by default. When developing your application, you'll often need to include static assets like images, JavaScript files, and styles. To ensure these files are served properly, you need to configure Fastify to handle static files.

Start by installing the `@fastify/static` plugin with the following command:

```command
npm install @fastify/static
```

Given that the `public` directory already includes a CSS file with styles, you need to configure Fastify to serve these files by setting up the appropriate middleware. Add the following code to your `src/app.js` file:

```javascript
[label src/app.js]
import Fastify from "fastify";
import fastifyView from "@fastify/view";
[higlight]
import fastifyStatic from "@fastify/static";
[/highlight]
...

await fastify.register(fastifyView, {
  ...
});

[highlight]
fastify.register(fastifyStatic, {
  root: path.join(__dirname, "public"),
  prefix: "/public/",
});
[/highlight]
...
```

In this code, you imported and registered the `fastifyStatic` plugin, setting the `public` directory as the root for static files and defining `/public/` as the URL prefix. This configuration tells Fastify where to find and serve static assets.

After saving your changes, refresh your browser to see the updates:

![Screenshot showing styles applied](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/b09ea735-6f30-411d-ef16-130ceb652500/orig =3024x1166)

You should now see the styles applied correctly.

## Step 5 — Connecting to the database using Fastify

Now that your application is set up, it's time to incorporate a database. You'll
use SQLite to manage your data, creating a reusable database connection
throughout your application. This section will guide you through setting up the
database, establishing the connection, and preparing the application to interact
with the database.

First, install the necessary SQLite package:

```command
npm install better-sqlite3
```

Next, create a `db.js` file in the `src/config` directory with the following
content:

```javascript
[label src/config/db.js]
import fp from "fastify-plugin";
import Database from "better-sqlite3";
import env from "./env.js";

async function dbConnector(fastify, options) {
  const dbFile = env.dbFile || "./blog.db";
  const db = new Database(dbFile, { verbose: console.log });

  db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  fastify.decorate("db", db);

  fastify.addHook("onClose", (fastify, done) => {
    db.close();
    done();
  });

  console.log("Database and posts table created successfully");
}

export default fp(dbConnector);
```

This code defines a Fastify plugin that connects to an SQLite database using the `better-sqlite3` library. The `dbConnector` function initializes the database from a file specified in the environment variables, defaulting to `./blog.db` if none is provided. It creates a `posts` table if it doesn't already exist, ensuring the necessary schema is in place. 

The line `fastify.decorate("db", db);` makes the database connection accessible throughout the application as `fastify.db`, allowing you to interact with the database in any route or plugin. Additionally, the plugin includes a cleanup hook to close the database connection when the server shuts down, ensuring a graceful shutdown process.

Now, register the database plugin in your `app.js` file:

```javascript
[label src/app.js]
...
import logger from "./config/logger.js";
import routes from "./routes/routes.js";
[highlight]
import dbConnector from "./config/db.js";
[/highlight]
...

[highlight]
fastify.register(dbConnector);
[/highlight]
await fastify.register(routes);
...
```

Here, the database plugin `dbConnector` is registered with Fastify. This ensures that the database connection is established when the server starts and accessible throughout your application via `request.server`:

```javascript
const post = await request.server.get("SELECT * FROM posts WHERE slug = ?", [
  slug,
]);
```

This setup provides a clean, modular approach to database integration in your
Fastify application. It separates database concerns from route logic and ensures
proper initialization and cleanup of the database connection.

In the next section, you'll leverage this database connection to implement
functionality for creating blog posts, building upon the solid foundation you've
established.

## Step 6 — Creating blog posts

With your database configured, you’re ready to implement the functionality for
creating blog posts. This step involves installing a package for generating URL
slugs, creating controller functions, and setting up a view template for the
post-creation form.

Start by installing the `slugify` package:

```command
npm install slugify
```

This package generates URL-friendly slugs from post titles, enhancing SEO and
making your blog post URLs more readable.

Next, create a `createPost.controller.js` file in your `controllers` directory:

```javascript
[label src/controllers/createPost.controller.js]
import slugify from "slugify";

export function getNewPost(request, reply) {
  return reply.view("new", { title: "Create New Post" });
}

export function createPost(request, reply) {
  const { title, content } = request.body;
  const slug = slugify(title, { lower: true, strict: true });
  const { db } = request.server;
  const insertStatement = db.prepare(
    "INSERT INTO posts (title, slug, content) VALUES (?, ?, ?)"
  );
  insertStatement.run(title, slug, content);
  return reply.redirect("/");
}
```

This file contains two essential functions: `getNewPost` and `createPost`. The
`getNewPost` function renders the form for creating a new post, while
`createPost` handles the form submission, creates a slug, inserts the new post
into the database, and redirects the user.

The use of `slugify` ensures that your post URLs will be clean and consistent,
improving both user experience and search engine optimization. The `strict`
option in the `slugify` function removes all characters that are not
alphanumeric or hyphens, further ensuring URL compatibility.

To complete the post creation flow, lets review the `new.ejs` template in the `views` directory:

```html
[label src/views/new.ejs]
<h1>Create New Post</h1>
<form class="create-post-form" action="/post" method="post">
  <label for="title">Title:</label>
  <input type="text" id="title" name="title" required />
  <label for="content">Content:</label>
  <textarea id="content" name="content" required></textarea>
  <button type="submit">Create</button>
</form>
```

This template provides a straightforward form for creating new blog posts. When
the form submits to the `/post` endpoint, your controller's `createPost`
function handles the submission.

Once the template is set up, you'll need to create a new route and corresponding
controller for handling the creation of posts:

```javascript
[label src/routes/routes.js]
import { getRoot } from "../controllers/root.controller.js";
[highlight]
import {
  getNewPost,
  createPost,
} from "../controllers/createPost.controller.js";
[/highlight]
export default async function routes(fastify, options) {
  fastify.get("/", getRoot);
[highlight]
  // Register post routes with the /post prefix
  fastify.register(
    async function (postRoutes) {
      postRoutes.get("/new", getNewPost);
      postRoutes.post("/", createPost);
    },
    { prefix: "/post" }
  );
[/highlight]
}
```

The highlighted code imports the `getNewPost` and `createPost` functions from
the `createPost.controller.js` file. It then registers these routes with a
`/post` prefix, where the `/new` route displays the form for creating a new
post, and the `/` route handles the form submission to create the post.

To enable Fastify to handle form input, use the `@fastify/formbody` plugin. First, install the package:

```command
npm install @fastify/formbody
```

Now you can register the plugin in your `app.js` file:

```javascript
[label src/app.js]
...
import fastifyView from "@fastify/view";
import fastifyStatic from "@fastify/static";
[highlight]
import fastifyFormbody from "@fastify/formbody";
[/highlight]
...

[highlight]
await fastify.register(fastifyFormbody);
[/highlight]
fastify.register(dbConnector);
...
```

This code adds form parsing capabilities to your Fastify application, allowing
it to handle POST requests with form data.

When you visit `http://localhost:3000/post/new` in your browser, you'll see the
form you created. You can now create a blog post with any content of your
choice:

![Screenshot of the filled form](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/2be22201-2b3d-4277-b6e8-9eb6d98e2e00/orig =3024x1764)

After submitting the form, you’ll be redirected to the homepage. However, you
won’t see the post listed yet, as the functionality to display posts on the
homepage hasn't been implemented:

![Screenshot of the homepage without blog posts listed](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/c85fddcc-5c70-43c6-9f03-3e3bcc299500/orig =3024x1758)

Currently, the setup allows users to submit posts with numeric or invalid inputs, which the database will accept without validation. We need to validate the input before storing it in the database to address this issue. This will ensure that only valid data is processed, improving the quality and integrity of the data in your application.

## Step 7 — Validating Inputs with Fastify

Fastify has built-in support for input validation using [Ajv](https://ajv.js.org/), a high-performance JSON schema validator. This allows you to define schemas for query strings, body values, and outgoing data, ensuring that incoming data matches your expectations and automatically handling errors for invalid inputs.

Implementing input validation offers several benefits:

- Enhances security by preventing malformed or malicious data.
- Improves data integrity within your application.
- Reduces the need for manual error checking in route handlers.
-  Automatically generates API documentation based on your schemas.

To validate incoming post data, enter the highlighted code below:

```javascript
[label src/controllers/createPost.controller.js]
import slugify from "slugify";
[highlight]
import Ajv from "ajv";

const ajv = new Ajv();

// Define the schema for post data
const postSchema = {
  type: "object",
  properties: {
    title: {
      type: "string",
      minLength: 1,
      maxLength: 100,
      pattern: "^(?=.*[a-zA-Z]).+$",
    },
    content: { type: "string", minLength: 1 },
  },
  required: ["title", "content"],
  additionalProperties: false,
};

const validatePost = ajv.compile(postSchema);
[/highlight]

export function getNewPost(request, reply) {
  return reply.view("new", { title: "Create New Post" });
}

export function createPost(request, reply) {
  const { title, content } = request.body;

[highlight]
  // Validate the input
  const valid = validatePost({ title, content });
  if (!valid) {
    return reply.status(400).send({
      error: "Invalid input",
      details: validatePost.errors,
    });
  }
[/highlight]

  const slug = slugify(title, { lower: true, strict: true });

  const { db } = request.server;

  const insertStatement = db.prepare(
    "INSERT INTO posts (title, slug, content) VALUES (?, ?, ?)"
  );
  insertStatement.run(title, slug, content);

  return reply.redirect("/");
}
```

The highlighted sections of the code are focused on validating the post data using the `Ajv` library. First, `Ajv` is imported and instantiated, and a schema is defined to specify the required structure and constraints for the `title` and `content` fields. 

This schema is then compiled into a validation function. Later, in the `createPost` function, this validation function checks whether the incoming data adheres to the schema. If the data is invalid, an error response with a status of `400` is returned, along with details about the validation errors. This ensures that only valid data is processed and stored.

After implementing this validation, you can test it by submitting invalid data (e.g., a numeric title) at `http://localhost:3000/post/new`:

![Screenshot of the form filled with invalid values](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/b000e79b-872b-4115-2bb3-810263942500/lg1x =3020x1546)

You'll receive a clear validation error, protecting your application from incorrect inputs and improving overall data integrity:

![Screenshot of validation with an error message](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/2b00c77a-94c1-438e-7cab-83a1a9986f00/lg2x =3024x1264)

With this validation in place, your application is now safeguarded against invalid inputs. In the next section, you will learn how to list and display the posts you’ve created.

## Step 8 — Listing the blog posts from the database

This section focuses on retrieving and displaying the blog posts you've created.
The process involves updating the root controller to fetch posts from the
database and modifying the index template to render these posts.

First, make the following changes to the `root.controller.js` file:

```javascript
[label src/controllers/root.controller.js]
export function getRoot(request, reply) {
[highlight]
  const { db } = request.server;
  const posts = db.prepare("SELECT * FROM posts").all();
  return reply.view("index", { title: "Homepage", posts });
[/highlight]
}

```

This updated code retrieves the database instance from the Fastify server,
executes a SQL query to fetch all posts, and passes the results to the
`index.ejs` template.

Next, clear the contents and add the following code to the `index.ejs` file:

```javascript
[label src/views/index.ejs]
<h1>Blog Posts</h1>
<% if (posts.length > 0) { %>
<ul class="posts">
  <% posts.forEach(post => { %>
  <li>
    <a href="/post/<%= post.slug %>" class="posts-title"><%= post.title %></a>
    <div class="post-actions">
      <a href="/post/<%= post.slug %>/edit" class="btn">Edit</a>
      <form
        action="/post/<%= post.slug %>/delete"
        method="post"
        class="posts-form"
      >
        <button type="submit" class="btn">Delete</button>
      </form>
    </div>
  </li>
  <% }) %>
</ul>
<% } else { %>
<p>There are no blog posts yet. Why not <a href="/post/new">create one</a>?</p>
<% } %>
```

This template iterates over the `posts` array and creates a list item for each post. Each post title is displayed as a link to the full post, with Edit and Delete buttons provided for each entry. If no posts are available, the template prompts the user to create a new one.

After saving these changes, reload `http://localhost:3000/` in your browser:

![Screenshot of the homepage listing the blog posts](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/2d36d9cc-9a48-40d9-16a4-d08a91580b00/md1x =3024x1750)

You should now see a list of blog posts displayed on the homepage. This update lets your application dynamically render user-generated content, making it a functional blog.

While the Edit and Delete buttons are visible, their functionality has yet to be implemented. In future steps, these features will be added to complete your blog application's CRUD functionality.

## Step 9 — Displaying full blog posts on dedicated pages

In this section, you'll implement a feature that allows users to view the full
content of individual blog posts on dedicated pages.

First, create the `getPost.controller.js` file:

```javascript
[label src/controllers/getPost.controller.js]
export function getPost(request, reply) {
  const { slug } = request.params;
  const { db } = request.server;
  const post = db.prepare("SELECT * FROM posts WHERE slug = ?").get(slug);

  if (!post) {
    return reply.status(404).send({ error: "Post not found" });
  }

  return reply.view("post", { title: post.title, post });
}
```

This controller function retrieves a blog post from the database using the slug
provided in the URL. If the post is found, it renders the post details using a
`post.ejs` template. If no post is found with the given slug, it returns a 404
error, indicating it is unavailable.

Next, review the `post.ejs` template in the `views` directory:

```html
[label src/views/post.ejs]
<div class="post-content">
  <h1><%= post.title %></h1>
  <p><%= post.content %></p>
  <a href="/">Back to Home</a>
</div>
```

This template displays a blog post's entire content, including its title and body. It also includes a "Back to Home" link for easy navigation back to the main list of posts.

Finally, add a route for viewing individual posts in your `routes.js` file:

```javascript
[label src/routes/routes.js]
...
[highlight]
import { getPost } from "../controllers/getPost.controller.js";
[/highlight]

export default async function routes(fastify, options) {
  ...
  fastify.register(
    async function (postRoutes) {
      postRoutes.get("/new", getNewPost);
      postRoutes.post("/", createPost);
[highlight]
      postRoutes.get("/:slug", getPost);
[/highlight]
    },
    { prefix: "/post" }
  );
}
...
```

This route uses the dynamic parameter `:slug` to match the URL with the
corresponding blog post. When a user clicks on a post title or navigates to a
specific URL like , the `getPost` controller fetches the relevant post and
renders it using the `post.ejs` template.

With these changes, you can now click on the blog post title from the homepage to view its entire content on a dedicated page. Or you can navigate to `http://localhost:3000/post/this-is-my-first-post`:

![Screenshot of the blog post content on a dedicated page](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/3ccd37f2-f22e-47ee-2214-43ca4ed55a00/public =3024x1638)

You will see that the blog post is being displayed in full.

In the following steps, you'll implement functionality for editing posts, allowing users to modify existing content.

## Step 10 — Editing blog posts

In this section, you'll implement functionality to allow users to edit existing
blog posts, enabling updates to both the title and content of their posts.

Create the `editPost.controller.js` file:

```javascript
[label src/controllers/editPost.controller.js]
import slugify from "slugify";

export function getEditPost(request, reply) {
  const { slug } = request.params;
  const { db } = request.server;
  const post = db.prepare("SELECT * FROM posts WHERE slug = ?").get(slug);

  if (!post) {
    return reply.status(404).send({ error: "Post not found" });
  }

  return reply.view("edit", { title: "Edit Post", post });
}

export function editPost(request, reply) {
  const { slug } = request.params;
  const { title, content } = request.body;
  const newSlug = slugify(title, { lower: true, strict: true });
  const { db } = request.server;

  const updateStatement = db.prepare(
    "UPDATE posts SET title = ?, slug = ?, content = ? WHERE slug = ?"
  );

  updateStatement.run(title, newSlug, content, slug);

  return reply.redirect(`/post/${newSlug}`);
}
```

This controller handles two main tasks: retrieving and rendering the post for
editing and processing updates. The `getEditPost` function fetches the post
based on its slug, rendering an edit form, and returns a 404 error if the post
isn't found. The `editPost` function processes the submitted form, updates the
post in the database with the new title, slug, and content, and then redirects
the user to the updated post page.

Next, review the `edit.ejs` template in the `views` directory:

```html
[label src/views/edit.ejs]
<h1>Edit Post</h1>
<form class="edit-post-form" action="/post/<%= post.slug %>/edit" method="post">
  <label for="title">Title:</label>
  <input
    type="text"
    id="title"
    name="title"
    value="<%= post.title %>"
    required
  />
  <label for="content">Content:</label>
  <textarea id="content" name="content" required><%= post.content %></textarea>
  <button type="submit">Update</button>
</form>
```

This template displays a pre-filled form with the current post's title and
content, allowing the user to edit it. When the form is submitted, it sends a
POST request to update the post in the database.

Finally, add the necessary routes to `routes.js`:

```javascript
[label src/routes/routes.js]
...
import { getPost } from "../controllers/getPost.controller.js";
[highlight]
import { getEditPost, editPost } from "../controllers/editPost.controller.js";
[/highlight]

export default async function routes(fastify, options) {
  fastify.get("/", getRoot);
  fastify.register(
    async function (postRoutes) {
...
[highlight]
      postRoutes.get("/:slug/edit", getEditPost);
      postRoutes.post("/:slug/edit", editPost);
[/highlight]
    },
    { prefix: "/post" }
  );
}
```

These routes handle both the GET request to display the edit form and the POST
request to process the form submission, updating the post in the database.

With these changes, you can now edit the blog post by either clicking the
**Edit** button on the homepage or navigating to
`http://localhost:3000/post/this-is-my-first-post/edit`:

![Screenshot showing the edited form contents](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/6d18bffd-0fc2-4fd9-5336-0a1d705d4800/public =3024x1728)

After updating and submitting the form, you'll be redirected to the updated post
page:

![Screenshot showing the updated post page](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/b08f0ead-f25e-4c66-90ae-adb38733f800/lg2x =3024x1696)

The homepage will also reflect the changes:

![Screenshot showing the updated title on the homepage](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/dd8df1b5-f694-4729-4904-10f205bedb00/lg1x =3024x1652)

This edit functionality completes another essential aspect of your blog
application's CRUD operations. In the next section, you'll add the ability to
delete posts, finalizing the core features needed for basic blog management.

## Step 11 — Deleting blog posts

To complete the CRUD functionality, you'll often need the ability to delete blog
posts. This section guides you through implementing the delete feature for your
blog application.

To do that, create a `deletePost.controller.js` file:

```javascript
[label src/controllers/deletePost.controller.js]
export function deletePost(request, reply) {
  const { slug } = request.params;
  const { db } = request.server;

  const deleteStatement = db.prepare("DELETE FROM posts WHERE slug = ?");
  deleteStatement.run(slug);

  return reply.redirect("/");
}
```

This code defines a `deletePost()` function that removes a blog post from the
database based on its slug. After the post is deleted, the user is redirected
back to the homepage.

Next, add the delete functionality to your routes by updating `routes.js`:

```javascript
[label src/routes/routes.js]
...
[highlight]
import { deletePost } from "../controllers/deletePost.controller.js";
[/higlight]

export default async function routes(fastify, options) {
  ...
  fastify.register(
    async function (postRoutes) {
      ...
      postRoutes.post("/:slug/edit", editPost);
[highlight]
      postRoutes.post("/:slug/delete", deletePost);
[/highlight]
    },
    { prefix: "/post" }
  );
}
```

This code adds the `deletePost` route, which allows the deletion of blog posts
through a POST request to `/post/:slug/delete`. This integrates the delete
functionality into the existing routing system.

Now, refresh the homepage at `http://localhost:3000/` and click on the
**delete** button for the post:

![Screenshot of the delete button](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/496b0b37-a01c-453d-facc-4a4c5c330200/md2x =3024x1202)

Afterwards, the post will be removed from the database, and you will be
redirected to the homepage, where the deleted post will no longer appear in the
list:

![Screenshot of the homepage showing the post deleted](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/f46ebac5-ac09-46e5-76d8-29a4f3b84500/md1x =3024x1212)

With the delete functionality, your blog application fully supports the
essential CRUD operations: Create, Read, Update, and Delete. This allows for
comprehensive blog management, giving users complete control over their content.

## Step 12 — Using Fastify hooks

Fastify’s middleware system, known as hooks, allows you to customize and enhance your application's request-response cycle. By defining custom hooks, you can intercept and modify requests and responses, perform additional operations, and add extra functionality to your application.

Fastify provides various hooks that execute at different stages of the request lifecycle:

- **onRequest**: Executes at the beginning of the request lifecycle before any parsing or validation.
- **preParsing**: Runs after the request is received but before it is parsed.
- **preValidation**: Executes after parsing but before validation, allowing you to modify the request before validation occurs.
- **preHandler**: Runs before the handler is executed, after validation is complete.
- **onResponse**: Executes after the response has been sent to the client, allowing you to perform actions post-response.

Each hook serves a specific purpose, allowing you to intervene at key points in the request processing pipeline.

To add middleware in Fastify, use the `addHook` method. Below is an example of how to implement basic request logging:

```javascript
[label src/app.js]
...
const fastify = Fastify({
  logger: logger,
});

fastify.addHook("onRequest", async (request, reply) => {
  request.log.info(`Incoming request: ${request.method} ${request.url}`);
});

fastify.addHook("onResponse", async (request, reply) => {
  request.log.info(
    `Request completed: ${request.method} ${request.url} - Status ${reply.statusCode}`
  );
});
...
```

In this example, the `onRequest` hook logs incoming requests, capturing the HTTP method and URL before the request is processed. The `onResponse` hook logs completed requests, including the HTTP method, URL, and status code after the response has been sent.

When you refresh the homepage at `http://localhost:3000/`, you will see output like this in the console:

```text
[output]
...
{"level":"info","time":"2024-08-18T16:14:36.380Z","pid":42449,"host":"ubuntu","reqId":"req-1","msg":"Incoming request: GET /"}
{"level":"info","time":"2024-08-18T16:14:36.385Z","pid":42449,"host":"ubuntu","reqId":"req-1","msg":"Request completed: GET / - Status 200"}
...
```

These hooks provide valuable insights into your application's request flow, enabling you to track and monitor incoming requests and their outcomes.

You can further customize these hooks or add more to implement advanced middleware features like authentication, rate limiting, or request transformation.

## Step 13 — Error handling with Fastify

Effective error handling is essential for any application, ensuring graceful degradation, improving user experience, and aiding in debugging. Fastify excels with its built-in error handling, which logs detailed error information and keeps the application running, a feature particularly useful during development.

Consider this example where an error is introduced by referencing a non-existent database table:

```javascript
[label root.controller.js]
export async function getRoot(request, reply) {
  const { db } = request.server;
[highlight]
  const posts = db.prepare("SELECT * FROM unkown_table").all();
[/highlight]
  return reply.view("index", { title: "Homepage", posts });
}
```

When you save and refresh the homepage, Fastify logs the error with comprehensive details:

```text
[output]
{"level":"error","time":"2024-08-18T16:21:15.456Z","pid":42707,"host":"ubuntu","reqId":"req-1","req":{"method":"GET","url":"/","hostname":"localhost:3000","remoteAddress":"::1","remotePort":56796},"res":{"statusCode":500},"err":{"type":"SqliteError","message":"no such table: unkown_table","stack":"SqliteError: no such table: unkown_table\n    at Database.prepare (/Users/stanley/fastify-blog/node_modules/better-sqlite3/lib/methods/wrappers.js:5:21)\n    at Object.getRoot ...    at Object.<anonymous> (/Users/stanley/d/fastify-blog/node_modules/@fastify/view/index.js:170:7)","code":"SQLITE_ERROR"},"msg":"no such table: unkown_table"}
..
```

In the output, Fastify automatically handles the error by logging the details and returning a 500 status code. This keeps the application running and provides useful information about where the error occurred.

If you refresh the homepage or run the following command:

```command
curl http://localhost:3000/ --include
```

You will see the following error response:

```text
[outptu]
HTTP/1.1 500 Internal Server Error
content-type: application/json; charset=utf-8
content-length: 112
Date: Sun, 18 Aug 2024 16:26:09 GMT
Connection: keep-alive
Keep-Alive: timeout=72

{"statusCode":500,"code":"SQLITE_ERROR","error":"Internal Server Error","message":"no such table: unkown_table"}%                                 
```
Fastify automatically sets the correct status code and generates an error message, making error handling straightforward.

However, in production, you can customize this behavior to provide less detailed error messages to users. To do this, start by creating a `middleware` directory in the `src` directory:

```command
mkdir src/middleware
```

Next, create an `error.js` file in the `middleware` directory with the following content:


```javascript
[label src/middleware/error.js]
import logger from "../config/logger.js";

function errorHandler(err, req, reply) {
  let statusCode = 500;
  let message = "internal server error";

  if (err.code === "FST_ERR_VALIDATION") {
    statusCode = 400;
    message = "validation error";
    logger.info(err);
  } else {
    logger.error(err);
  }

  const response = {
    code: statusCode,
    message,
  };

  reply.code(statusCode).send(response);
}

export default errorHandler;
```

This middleware captures unhandled errors, logs them appropriately, and sends a structured response to the client with a less detailed message, suitable for production environments.

Now, register the error-handling middleware in your `routes.js` file:


```javascript
[label src/routes/routes.js]
...
[highlight]
import errorHandler from "../middleware/error.js";
[/highlight]

export default async function routes(fastify, options) {
  fastify.get("/", getRoot);
  // Register post routes with the /post prefix
  fastify.register(
    ...
  );
[highlight]
  fastify.setErrorHandler(errorHandler);
[/highlight]
}
```
After implementing this, run the following command to test the error response:


```command
curl http://localhost:3000/ --include
```

You should now see a response with a simplified error message:

```text
[output]
HTTP/1.1 500 Internal Server Error
content-type: application/json; charset=utf-8
content-length: 46
...

{"code":500,"message":"internal server error"}%                             
```

With these changes, error messages are less detailed for end-users in production, improving security while still logging detailed information for debugging. You can now proceed to the next section to explore adding security headers to enhance your application's robustness further.

## Step 14 — Enhancing application security and performance with Fastify plugins

In this section, you'll enhance your Fastify application by adding several key
plugins to improve functionality, security, and performance.

Here is the overview of the plugins:

1. `@fastify/cors`: Enables
   [Cross-Origin Resource Sharing (CORS)](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
   for your application.

2. `@fastify/helmet`: Adds security-related HTTP headers to protect your
   application from common web vulnerabilities, such as XSS and clickjacking.

3. `@fastify/compress`: Compresses response bodies, which can significantly
   improve your application's performance by reducing the size of the data sent
   over the network.

4. `fastify-graceful-shutdown`: Ensures that your application shuts down
   gracefully, finishing ongoing requests before closing, which is essential for
   maintaining a good user experience during application restarts or shutdowns.

You can install these plugins using the following command:

```command
npm install @fastify/cors @fastify/helmet @fastify/compress fastify-graceful-shutdown
```

After installation, import and register the plugins in your `app.js` file:

```javascript
[label src/app.js]
...
import fastifyFormbody from "@fastify/formbody";
[highlight]
import fastifyCors from "@fastify/cors";
import fastifyHelmet from "@fastify/helmet";
import fastifyCompress from "@fastify/compress";
import fastifyGracefulShutdown from "fastify-graceful-shutdown";
[/highlight]
...

const createServer = async () => {
  ...
[highlight]
  await fastify.register(fastifyCors);
  await fastify.register(fastifyHelmet);
  await fastify.register(fastifyCompress);
  await fastify.register(fastifyGracefulShutdown);
[/highlight]
  await fastify.register(fastifyFormbody);
  fastify.register(dbConnector);

  await fastify.register(routes);

  return fastify;
};

export default createServer;
```

This code registers each plugin with the Fastify instance.

Verify that the plugins are working as expected with the following command:

```command
curl http://localhost:3000/ --include
```

You should see output similar to the following:

```text
[output]
HTTP/1.1 200 OK
Content-Security-Policy: default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-origin
Origin-Agent-Cluster: ?1
Referrer-Policy: no-referrer
Strict-Transport-Security: max-age=15552000; includeSubDomains
X-Content-Type-Options: nosniff
X-DNS-Prefetch-Control: off
X-Download-Options: noopen
X-Frame-Options: SAMEORIGIN
X-Permitted-Cross-Domain-Policies: none
X-XSS-Protection: 0
```

The output confirms that the `fastifyHelmet` plugin is active, with essential
security headers such as `Content-Security-Policy` and
`Strict-Transport-Security` in place. These headers strengthen your
application's defense against common web vulnerabilities. Additionally, you'll
notice that the `X-Powered-By` header has been removed as a security measure to
make your server less identifiable, reducing the risk of targeted attacks..

Though not visible in the curl output, the other plugins also function. The
compressing plugin optimizes response sizes, and the Graceful Shutdown plugin
ensures your application can close smoothly when needed.

## Final thoughts

This article guides you through the basics of building a Fastify application, focusing on implementing full CRUD operations—creating, editing, deleting, and listing blog posts. It also covers essential concepts like reading environment variables, creating Fasify plugins, adding plugins for security and performance, and handling errors effectively. As a next step, explore the [Fastify](https://fastify.dev/docs/latest/) documentation for a deeper dive into its extensive features.