# Getting Started with GraphQL and Express

[Express.js](https://expressjs.com/) is the go-to web framework for Node.js developers who want to build APIs quickly and efficiently. 

When you combine Express with [GraphQL](https://graphql.org/), you get a powerful setup for creating flexible APIs that let clients request exactly the data they need. No more over-fetching or under-fetching data.

This tutorial will show you how to build production-ready GraphQL APIs using Express and [GraphQL.js](https://graphql.org/graphql-js/), the main GraphQL implementation for JavaScript.

[ad-logs]

## Prerequisites

You'll need [Node.js 20](https://nodejs.org/) or newer installed on your machine. This tutorial assumes you know JavaScript ES6+ features, Express.js basics, and how APIs work.

## Creating your Express GraphQL project

To get the most out of this tutorial, you'll want to set up a fresh Express project so you can follow along and experiment with the concepts yourself.

Let's build a complete project from scratch so you can see how GraphQL works with Express and learn the best way to structure your code.

Start by creating a new directory for your project and navigating into it:

```command
mkdir express-graphql-api && cd express-graphql-api
```

Initialize a new Node.js project with default settings:

```command
npm init -y
```

Install the essential packages you need for GraphQL integration:

```command
npm install express graphql graphql-http ruru
```

Here's what each package provides:

* `express`: The core web framework that handles HTTP requests and routing
* `graphql`: The JavaScript reference implementation that provides schema building and query execution
* `graphql-http`: A middleware that seamlessly connects GraphQL to Express, handling request parsing and response formatting
* `ruru`: Provides the GraphiQL IDE interface for testing and exploring your GraphQL API

Set up ES modules by updating your `package.json`:

```json
[label package.json]
{
  "name": "express-graphql-api",
  "version": "1.0.0",
  [highlight]
  "type": "module",
  [/highlight]
  "scripts": {
    [highlight]
    "dev": "node --watch server.js",
    "start": "node server.js"
    [/highlight]

  }
}
```

The `"type": "module"` setting enables ES module syntax throughout your project, allowing you to use modern `import/export` statements. The `--watch` flag tells Node.js to automatically restart your server when files change, eliminating the need for external tools like nodemon.

Create a basic `server.js` file with your initial GraphQL setup:

```javascript
[label server.js]
import express from 'express';
import { GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql';
import { createHandler } from 'graphql-http/lib/use/express';
import { ruruHTML } from 'ruru/server';

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    hello: {
      type: GraphQLString,
      resolve: () => 'Hello, GraphQL with Express!'
    }
  }
});

const schema = new GraphQLSchema({ query: Query });

const app = express();

// GraphQL endpoint
app.all('/graphql', createHandler({ schema }));

// Serve GraphiQL IDE
app.get('/', (_req, res) => {
  res.type('html');
  res.end(ruruHTML({ endpoint: '/graphql' }));
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/graphql`);
  console.log(`GraphiQL IDE available at http://localhost:${PORT}/`);
});
```

This foundational setup demonstrates the core GraphQL pattern with Express. The `Query` object defines your root query type with a simple `hello` field, while the `createHandler` function bridges GraphQL and Express by automatically handling request parsing, schema execution, and response formatting. The `ruruHTML` function provides the GraphiQL interface for easy testing.

Start your server using Node's built-in watch mode:

```command
npm run dev
```

```text
[output]

> express-graphql-api@1.0.0 dev
> node --watch server.js

Server running on http://localhost:4000/graphql
GraphiQL IDE available at http://localhost:4000/
```

Open `http://localhost:4000/` in your browser to see GraphiQL, the interactive GraphQL IDE:

![Screenshot of GraphiQL interface with Express GraphQL](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/479ed407-b0f1-43af-8348-69219a540b00/lg2x =3248x1996)

GraphiQL provides a powerful development environment with features like intelligent autocomplete, syntax highlighting, and built-in schema exploration. These tools make it easy to experiment with queries and understand your API's structure.

Test your setup with this simple query:

```graphql
{
  hello
}
```

You should see:

```json
[output]
{
  "data": {
    "hello": "Hello, GraphQL with Express!"
  }
}
```

![Screenshot of hello message from GraphQL](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/e5568c4e-fa22-4dbc-7b5d-b1c97b391600/md1x =3248x1996)

This response structure is standard for GraphQL - all successful queries return data wrapped in a `data` field, making it easy for clients to parse and handle responses consistently.

## Building your first GraphQL types

GraphQL is all about types. They define the structure of your data and what clients can request. Unlike REST APIs where you define endpoints, GraphQL uses a type system to describe your entire API in one unified schema.

Let's move beyond the simple "hello" query and create some real data types that you'd use in actual applications.

Create a `types.js` file to organize your GraphQL types:

```javascript
[label types.js]
import { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLNonNull } from 'graphql';

export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    role: { type: GraphQLString }
  }
});

// Sample data for demonstration
export const users = [
  { id: 1, name: 'Sarah Chen', email: 'sarah@example.com', role: 'developer' },
  { id: 2, name: 'Mike Johnson', email: 'mike@example.com', role: 'designer' },
  { id: 3, name: 'Emma Wilson', email: 'emma@example.com', role: 'manager' }
];
```

The `GraphQLNonNull` wrapper ensures that certain fields always return values, which helps prevent null-related errors in your client applications. Fields without this wrapper can return `null` if no data is available.

Now update your `server.js` to use the new User type:

```javascript
[label server.js]
import express from 'express';
import { GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql';
import { createHandler } from 'graphql-http/lib/use/express';
import { ruruHTML } from 'ruru/server';
[highlight]
import { UserType, users } from './types.js';
[/highlight]

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    hello: {
      type: GraphQLString,
      resolve: () => 'Hello, GraphQL with Express!'
    },
    [highlight]
    user: {
      type: UserType,
      resolve: () => users[0]
    }
    [/highlight]
  }
});

const schema = new GraphQLSchema({ query: Query });
...
```

Test your new user query in GraphiQL:

```graphql
{
  user {
    id
    name
    email
    role
  }
}
```

You should see:

```json
[output]
{
  "data": {
    "user": {
      "id": 1,
      "name": "Sarah Chen",
      "email": "sarah@example.com",
      "role": "developer"
    }
  }
}
```

![Screenshot of GraphiQL showing user query results](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/ee811df6-b4f1-4ac3-5df0-2430c6d4c500/md2x =3248x1996)

Notice how you can request only the fields you need. Try querying just the name and email by removing `id` and `role` from your query - GraphQL will only return the data you specifically request.

## Adding query arguments and lists

One of GraphQL's most powerful features is the ability to pass arguments to queries and return lists of data. This lets you build flexible APIs that can filter, search, and paginate data based on client needs.

Let's enhance your API to support querying multiple users and finding specific users by ID.

Update your `server.js` to add list queries and arguments:

```javascript
[label server.js]
import express from 'express';
[highlight]
import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt, GraphQLNonNull } from 'graphql';
[/highlight]
import { createHandler } from 'graphql-http/lib/use/express';
import { ruruHTML } from 'ruru/server';
import { UserType, users } from './types.js';

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    hello: {
      type: GraphQLString,
      resolve: () => 'Hello, GraphQL with Express!'
    },
    [highlight]
    users: {
      type: new GraphQLList(UserType),
      resolve: () => users
    },
    user: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve: (parent, args) => users.find(user => user.id === args.id)
    }
    [/highlight]
  }
});

...
```

The `GraphQLList` wrapper tells GraphQL that this field returns an array of items. The `args` object defines what parameters the query accepts - in this case, an `id` field that must be provided.

Now you can query all users or find a specific user by ID:

```graphql
{
  users {
    id
    name
    email
  }
  user(id: 1) {
    name
    role
  }
}
```

You should see:

```json
[output]
{
  "data": {
    "users": [
      {
        "id": 1,
        "name": "Sarah Chen",
        "email": "sarah@example.com"
      },
      {
        "id": 2,
        "name": "Mike Johnson",
        "email": "mike@example.com"
      },
      {
        "id": 3,
        "name": "Emma Wilson",
        "email": "emma@example.com"
      }
    ],
    "user": {
      "name": "Sarah Chen",
      "role": "developer"
    }
  }
}
```

![Screenshot of GraphiQL showing list query results](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/90e3f501-1026-45bb-b989-3b79aaad1800/md2x =3248x1996)

This demonstrates GraphQL's efficiency - you can request multiple different queries in a single request, each returning exactly the fields you need. Try changing the `id` parameter to `2` or `3` to see different users returned.



## Creating relationships between types

Real-world applications need to model relationships between different data types. GraphQL excels at this - you can define how types connect to each other and let clients traverse these relationships in a single query.

Let's add books and authors to demonstrate how GraphQL handles relationships.

First, expand your `types.js` to include books and authors:

```javascript
[label types.js]
import { 
  GraphQLObjectType, 
  GraphQLString, 
  GraphQLInt, 
  GraphQLNonNull,
  [highlight]
  GraphQLList
  [/highlight]
} from 'graphql';

[highlight]
export const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    books: {
      type: new GraphQLList(BookType),
      resolve: (parent) => books.filter(book => book.authorId === parent.id)
    }
  })
});

export const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    isbn: { type: new GraphQLNonNull(GraphQLString) },
    publishedYear: { type: new GraphQLNonNull(GraphQLInt) },
    author: {
      type: AuthorType,
      resolve: (parent) => authors.find(author => author.id === parent.authorId)
    }
  })
});
[/highlight]

export const UserType = new GraphQLObjectType({
  ...
});

[highlight]
// Sample data
export const authors = [
  { id: 1, name: 'Margaret Atwood', email: 'margaret@example.com' },
  { id: 2, name: 'Haruki Murakami', email: 'haruki@example.com' }
];

export const books = [
  { id: 1, title: 'The Handmaid\'s Tale', isbn: '978-0-385-49081-8', publishedYear: 1985, authorId: 1 },
  { id: 2, title: 'Norwegian Wood', isbn: '978-0-375-70427-8', publishedYear: 1987, authorId: 2 },
  { id: 3, title: 'Oryx and Crake', isbn: '978-0-385-50385-4', publishedYear: 2003, authorId: 1 }
];
[/highlight]

// Sample data for demonstration
export const users = [
  ...
];
```

The arrow functions in the `fields` property allow `AuthorType` and `BookType` to reference each other without creating circular dependency issues. The resolve functions show how to connect related data.

Update your `server.js` to include the new types:

```javascript
[label server.js]
...
import { ruruHTML } from 'ruru/server';
import { 
  UserType, 
  users, 
  [highlight]
  AuthorType, 
  BookType, 
  authors, 
  books
  [/highlight]
} from './types.js';

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    hello: {
      type: GraphQLString,
      resolve: () => 'Hello, GraphQL with Express!'
    },
    users: {
      type: new GraphQLList(UserType),
      resolve: () => users
    },
    user: {
      type: UserType,
      args: { id: { type: new GraphQLNonNull(GraphQLInt) } },
      resolve: (parent, args) => users.find(user => user.id === args.id)
    },
    [highlight]
    books: {
      type: new GraphQLList(BookType),
      resolve: () => books
    },
    book: {
      type: BookType,
      args: { id: { type: new GraphQLNonNull(GraphQLInt) } },
      resolve: (parent, args) => books.find(book => book.id === args.id)
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve: () => authors
    },
    author: {
      type: AuthorType,
      args: { id: { type: new GraphQLNonNull(GraphQLInt) } },
      resolve: (parent, args) => authors.find(author => author.id === args.id)
    }
    [/highlight]
  }
});

...
```

Now test a query that traverses relationships:

```graphql
{
  books {
    id
    title
    publishedYear
    author {
      name
      email
    }
  }
}
```

You should see:

```json
[output]
{
  "data": {
    "books": [
      {
        "id": 1,
        "title": "The Handmaid's Tale",
        "publishedYear": 1985,
        "author": {
          "name": "Margaret Atwood",
          "email": "margaret@example.com"
        }
      },
      {
        "id": 2,
        "title": "Norwegian Wood",
        "publishedYear": 1987,
        "author": {
          "name": "Haruki Murakami",
          "email": "haruki@example.com"
        }
      },
      {
        "id": 3,
        "title": "Oryx and Crake",
        "publishedYear": 2003,
        "author": {
          "name": "Margaret Atwood",
          "email": "margaret@example.com"
        }
      }
    ]
  }
}
```

![Screenshot of GraphiQL displaying nested query results with book and author data](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/4912ebce-e60d-4cb1-66ee-dcebc90bbc00/md1x =3248x1996)

This demonstrates GraphQL's power to automatically resolve relationships and return all related data in a single request. Try querying authors and their books to see the reverse relationship in action.

## Final thoughts
You've built a complete GraphQL API with Express.js using modern ES modules and Node's built-in watch mode. You learned how to create types, handle query arguments and lists, and build relationships between different data entities.

This foundation gives you everything you need to start building production-ready GraphQL APIs. Your next steps might include adding mutations for data modification, connecting to a database like PostgreSQL or MongoDB, implementing authentication and authorization, or exploring real-time features with subscriptions.

For deeper learning, explore the official [GraphQL documentation](https://graphql.org/learn/) and [Express.js guides](https://expressjs.com/en/guide/routing.html).

Happy coding!