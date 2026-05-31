# How to Use Fastify with GraphQL

[Fastify](https://fastify.dev/) is one of the fastest Node.js web frameworks you can use today. It gives you great performance while keeping things simple for developers.

When you combine Fastify with [GraphQL](https://graphql.org/), you get a powerful setup for building APIs that handle complex data needs while staying lightning fast.

This guide shows you how to build GraphQL APIs with Fastify and [Mercurius](https://mercurius.dev/), the leading GraphQL plugin designed specifically for Fastify's architecture.

[ad-logs]

## Prerequisites

Make sure you have [Node.js 18](https://nodejs.org/) or newer on your computer. This guide assumes you know JavaScript ES6+ features, basic Fastify concepts, and how APIs work.

## Setting up your Fastify GraphQL application
Instead of jumping into theory, you'll build a working app step by step. This way, you'll understand each part as you create it.

This hands-on approach helps you learn not just how to do things, but why you do them.

Start by creating your project folder and moving into it:

```command
mkdir fastify-graphql-server && cd fastify-graphql-server
```

Create your Node.js project:

```command
npm init -y
```

Install the packages you need for GraphQL with Fastify:

```command
npm install fastify mercurius graphql
```

Here's what each package does:

* `fastify`: The fast web framework that handles HTTP requests and plugins
* `mercurius`: A GraphQL plugin built specifically for Fastify with excellent performance
* `graphql`: The core GraphQL library that parses queries and executes them

Set up ES modules in your `package.json`:

```json
[label package.json]
{
  "name": "fastify-graphql-server",
  "version": "1.0.0",
  [highlight]
  "type": "module",
  [/highlight]
  "scripts": {
    [highlight]
    "dev": "node --watch app.js",
    "start": "node app.js"
    [/highlight]
  }
}
```

The `"type": "module"` setting lets you use modern JavaScript syntax throughout your project. The `--watch` flag automatically restarts your server when you change files.

Create your main app file with basic GraphQL setup:

```javascript
[label app.js]
import fastify from 'fastify';

const app = fastify({ logger: true });

const schema = `
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: async () => 'Hello, Fastify with GraphQL!'
  }
};

app.register(import('mercurius'), {
  schema,
  resolvers,
  graphiql: true
});

const start = async () => {
  try {
    const PORT = 3000;
    await app.listen({ port: PORT });
    console.log(`Server running at http://localhost:${PORT}/graphql`);
    console.log(`GraphiQL available at http://localhost:${PORT}/graphiql`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
```

This setup shows how Mercurius integrates with Fastify's plugin system. The `graphiql: true` option gives you a built-in GraphQL IDE for testing your queries.

Start your development server:

```command
npm run dev
```

```text
[output]
> fastify-graphql-server@1.0.0 dev
> node --watch app.js

{"level":30,"time":1752494060029,"pid":69566,"hostname":"MacBookPro","msg":"Server listening at http://[::1]:3000"}
{"level":30,"time":1752494060030,"pid":69566,"hostname":"MacBookPro","msg":"Server listening at http://127.0.0.1:3000"}
Server running at http://localhost:3000/graphql
GraphiQL available at http://localhost:3000/graphiql
```

Go to `http://localhost:3000/graphiql` to see the GraphiQL interface. This interactive tool has autocomplete, syntax highlighting, and lets you explore your schema.

![Screenshot of GraphiQL interface with Fastify GraphQL](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/0d8dc377-97c1-42cb-a82c-3b46824f7800/public =3248x1996)

GraphiQL provides a powerful development environment with features like intelligent autocomplete, syntax highlighting, and built-in schema exploration. These tools make it easy to experiment with queries and understand your API's structure.

Test your setup with this query:

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
    "hello": "Hello, Fastify with GraphQL!"
  }
}
```

![Screenshot of hello message from GraphQL](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/83332b52-f5d3-4d51-f886-d15285d90c00/md2x =3248x1996)

This response follows GraphQL rules - successful results go in a `data` field, which makes it easy for clients to handle responses.

## Designing your GraphQL schema

GraphQL schemas act like contracts between your API and clients. They define what operations are available and what data looks like. Unlike REST APIs that focus on endpoints, GraphQL uses a type system to describe your entire API.

Mercurius uses a schema-first approach where you define your schema using GraphQL Schema Definition Language (SDL). This gives you better visibility into your API design and makes teamwork easier.

Create a file for your schema definitions:

```javascript
[label types.js]
export const schema = `
  type User {
    id: ID!
    name: String!
    email: String!
    role: String
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
    hello: String
  }
`;

export const users = [
  { id: '1', name: 'Alex Chen', email: 'alex@example.com', role: 'developer' },
  { id: '2', name: 'Maria Garcia', email: 'maria@example.com', role: 'designer' },
  { id: '3', name: 'James Wilson', email: 'james@example.com', role: 'manager' }
];
```

The exclamation mark (`!`) means fields can't be null. This type safety prevents runtime errors and makes your API more predictable for client developers.

Update your main app file to use the new schema:

```javascript
[label app.js]
import fastify from 'fastify';
[highlight]
import { schema, users } from './types.js';
[/highlight]

const app = fastify({ logger: true });
[highlight]
// remove the schema variable around here
[/highlight]
const resolvers = {
  Query: {
    hello: async () => 'Hello, Fastify with GraphQL!',
    [highlight]
    users: async () => users,
    user: async (parent, args) => users.find(user => user.id === args.id)
    [/highlight]
  }
};

...
```

Test your improved schema with a query that shows field selection:

```graphql
{
  users {
    id
    name
    email
  }
  user(id: "1") {
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
        "id": "1",
        "name": "Alex Chen",
        "email": "alex@example.com"
      },
      {
        "id": "2",
        "name": "Maria Garcia",
        "email": "maria@example.com"
      },
      {
        "id": "3",
        "name": "James Wilson",
        "email": "james@example.com"
      }
    ],
    "user": {
      "name": "Alex Chen",
      "role": "developer"
    }
  }
}
```

![Screenshot of GraphiQL showing list query results](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/4fd195b2-9b23-4a3a-a3f5-2ce3d9795c00/lg2x =3248x1996)

This shows GraphQL's efficiency - you can make multiple queries in one request, and each returns exactly the fields you need.


## Creating relationships between types

Real apps need to connect different types of data. GraphQL is great at this - you can define how types relate to each other and let clients get all related data in one query.

You'll add projects and tasks to show how GraphQL handles nested relationships. The key is understanding how GraphQL resolvers work together to fetch related data automatically.

Expand your `types.js` to include related data:

```javascript
[label types.js]
export const schema = `
  type User {
    id: ID!
    name: String!
    email: String!
    role: String
    [highlight]
    projects: [Project!]!
    [/highlight]
  }

  [highlight]
  type Project {
    id: ID!
    title: String!
    description: String!
    owner: User!
    tasks: [Task!]!
  }

  type Task {
    id: ID!
    title: String!
    completed: Boolean!
    project: Project!
  }
  [/highlight]

  type Query {
    users: [User!]!
    user(id: ID!): User
    [highlight]
    projects: [Project!]!
    project(id: ID!): Project
    [/highlight]
    hello: String
  }
`;

export const users = [
  { id: "1", name: "Alex Chen", email: "alex@example.com", role: "developer" },
  {
    id: "2",
    name: "Maria Garcia",
    email: "maria@example.com",
    role: "designer",
  },
  {
    id: "3",
    name: "James Wilson",
    email: "james@example.com",
    role: "manager",
  },
];

[highlight]
export const projects = [
  { id: '1', title: 'Mobile App', description: 'iOS and Android app', ownerId: '1' },
  { id: '2', title: 'Website Redesign', description: 'New company website', ownerId: '2' },
  { id: '3', title: 'API Gateway', description: 'Microservices gateway', ownerId: '1' }
];

export const tasks = [
  { id: '1', title: 'Setup authentication', completed: false, projectId: '1' },
  { id: '2', title: 'Design user interface', completed: true, projectId: '1' },
  { id: '3', title: 'Create wireframes', completed: true, projectId: '2' },
  { id: '4', title: 'Configure routing', completed: false, projectId: '3' }
];
[/highlight]
```

Notice how the relationships work in the schema:
- Each `User` can have multiple `projects` (array relationship)
- Each `Project` has one `owner` (single relationship) and multiple `tasks`
- Each `Task` belongs to one `project`

The data uses foreign keys to connect records. Projects have an `ownerId` that matches a user's `id`, and tasks have a `projectId` that matches a project's `id`. This is similar to how you'd structure a relational database.

Update your resolvers to handle the relationships:

```javascript
[label app.js]
import fastify from 'fastify';
[highlight]
import { schema, users, projects, tasks } from './types.js';
[/highlight] 
const app = fastify({ logger: true });

const resolvers = {
  Query: {
    hello: async () => 'Hello, Fastify with GraphQL!',
    users: async () => users,
    user: async (parent, args) => users.find(user => user.id === args.id),
    [highlight]
    projects: async () => projects,
    project: async (parent, args) => projects.find(project => project.id === args.id)
    [/highlight]
  },
  
  [highlight]
  User: {
    projects: async (parent) => projects.filter(project => project.ownerId === parent.id)
  },
  
  Project: {
    owner: async (parent) => users.find(user => user.id === parent.ownerId),
    tasks: async (parent) => tasks.filter(task => task.projectId === parent.id)
  },
  
  Task: {
    project: async (parent) => projects.find(project => project.id === parent.projectId)
  }
  [/highlight]
};

app.register(import('mercurius'), {
  schema,
  resolvers,
  graphiql: true
});

...
```

Here's what's happening with the new resolvers:

**Type-level resolvers** work differently from query resolvers. When GraphQL needs to resolve a field on a type, it calls the corresponding resolver function and passes the parent object as the first argument.

- `User.projects` resolver: When someone queries for a user's projects, this function receives the user object as `parent` and finds all projects where `ownerId` matches the user's `id`
- `Project.owner` resolver: When someone queries for a project's owner, this function receives the project object as `parent` and finds the user whose `id` matches the project's `ownerId`
- `Project.tasks` resolver: Finds all tasks that belong to this project by matching `projectId`
- `Task.project` resolver: Finds the project that this task belongs to

The magic happens when GraphQL executes these resolvers automatically. If you query for users and their projects, GraphQL will:
1. Execute the `users` query resolver to get all users
2. For each user, execute the `User.projects` resolver to get their projects
3. For each project, execute any nested resolvers you've requested

Test a query that follows relationships:

```graphql
{
  projects {
    id
    title
    owner {
      name
      email
    }
    tasks {
      title
      completed
    }
  }
}
```

This query demonstrates the power of GraphQL relationships:
1. Gets all projects from the `projects` query resolver
2. For each project, the `Project.owner` resolver finds the user who owns it
3. For each project, the `Project.tasks` resolver finds all tasks that belong to it
4. GraphQL automatically handles all the data fetching and returns a nested response

You should see:

```json
{
  "data": {
    "projects": [
      {
        "id": "1",
        "title": "Mobile App",
        "owner": {
          "name": "Alex Chen",
          "email": "alex@example.com"
        },
        "tasks": [
          {
            "title": "Setup authentication",
            "completed": false
          },
          {
            "title": "Design user interface",
            "completed": true
          }
        ]
      },
...
      {
        "id": "3",
        "title": "API Gateway",
        "owner": {
          "name": "Alex Chen",
          "email": "alex@example.com"
        },
        "tasks": [
          {
            "title": "Configure routing",
            "completed": false
          }
        ]
      }
    ]
  }
}
```

![Screenshot of GraphiQL displaying nested query results with project and task data](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/c0c4e2ae-91c1-4a2c-cbc4-19fd54d59100/public =3248x1996)

This shows GraphQL's power. It automatically resolves relationships and returns all related data in one request.

Unlike REST APIs where you'd need multiple requests to get users, their projects, and project tasks, GraphQL fetches everything in a single query with the exact data structure you need.

## Adding mutations for data modification

GraphQL mutations handle data changes like creating, updating, and deleting records. While queries only read data, mutations let clients change server state in a predictable and type-safe way.

Mercurius has great support for mutations with automatic input validation and error handling. You'll add a user creation mutation to see how data modification works in GraphQL.

Add mutation operations to your schema:

```javascript
[label types.js]
export const schema = `
  type User {
    id: ID!
    name: String!
    email: String!
    role: String
    projects: [Project!]!
  }

...
  type Task {
    id: ID!
    title: String!
    completed: Boolean!
    project: Project!
  }

  [highlight]
  input CreateUserInput {
    name: String!
    email: String!
    role: String
  }
  [/highlight]

  type Query {
    users: [User!]!
    user(id: ID!): User
    projects: [Project!]!
    project(id: ID!): Project
    hello: String
  }

  [highlight]
  type Mutation {
    createUser(input: CreateUserInput!): User!
  }
  [/highlight]
`;

[highlight]
// Make data mutable for mutations
export let users = [
[/highlight]
  { id: "1", name: "Alex Chen", email: "alex@example.com", role: "developer" },
  {
    id: "2",
    name: "Maria Garcia",
    email: "maria@example.com",
    role: "designer",
  },
  {
    id: "3",
    name: "James Wilson",
    email: "james@example.com",
    role: "manager",
  },
];
...
```

**Input types** are special GraphQL types that define the structure of data clients can send to mutations. They're similar to regular types but can only be used as arguments. The `!` on required fields ensures clients provide all necessary data.

Notice you changed `users` from `const` to `let` so mutations can modify the array. In a real app, you'd use a database instead of in-memory arrays.

Update your resolvers to handle mutations:

```javascript
[label app.js]
import fastify from 'fastify';
import { schema, users, projects, tasks } from './types.js';

const app = fastify({ logger: true });

[highlight]
let nextId = 4;
[/highlight]

const resolvers = {
  Query: {
    hello: async () => 'Hello, Fastify with GraphQL!',
    users: async () => users,
    user: async (parent, args) => users.find(user => user.id === args.id),
    projects: async () => projects,
    project: async (parent, args) => projects.find(project => project.id === args.id)
  },
  
  [highlight]
  Mutation: {
    createUser: async (parent, args, context) => {
      const { input } = args;
      context.app.log.info('Creating user', input);
      
      // Check if email already exists
      const existingUser = users.find(user => user.email === input.email);
      if (existingUser) {
        throw new Error('Email already exists');
      }
      
      const newUser = {
        id: nextId.toString(),
        ...input
      };
      
      users.push(newUser);
      nextId++;
      
      return newUser;
    }
  },
  [/highlight]
  
  User: {
    projects: async (parent) => projects.filter(project => project.ownerId === parent.id)
  },
  
  Project: {
    owner: async (parent) => users.find(user => user.id === parent.ownerId),
    tasks: async (parent) => tasks.filter(task => task.projectId === parent.id)
  },
  
  Task: {
    project: async (parent) => projects.find(project => project.id === parent.projectId)
  }
};

app.register(import('mercurius'), {
  schema,
  resolvers,
  graphiql: true
});

...
```


The **Mutation resolvers** work similarly to query resolvers but they modify data instead of just reading it. They receive three arguments: `parent` (usually null for root mutations), `args` (contains the input data from the client), and `context` (provides access to Fastify's app instance and request context).

The `createUser` mutation first extracts the input data from arguments and logs the operation using Fastify's logger. It then validates that the email doesn't already exist by searching through the existing users. If the email is unique, it creates a new user object with a generated ID using the spread operator to copy all input fields. Finally, it adds the user to the array, increments the ID counter, and returns the new user object.

When you throw an error in a resolver, GraphQL automatically formats it as a proper GraphQL error response.

Test your mutation functionality:

```graphql
mutation {
  createUser(input: {
    name: "Sarah Davis"
    email: "sarah@example.com"
    role: "analyst"
  }) {
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
    "createUser": {
      "id": "4",
      "name": "Sarah Davis",
      "email": "sarah@example.com",
      "role": "analyst"
    }
  }
}
```

![Screenshot of GraphiQL showing mutation results](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/c4213eaa-711c-4ae3-a2d5-2cc66d9e8a00/lg2x =3248x1996)

This mutation pattern gives you type safety, validation, and consistent error handling while using Fastify's logging and context features. The mutation automatically validates input types and provides detailed error messages if something goes wrong.


## Final thoughts
You now have a solid GraphQL API built with Fastify and Mercurius. You've learned how to create schemas, write resolvers, handle relationships between data types, and modify data with mutations.

This gives you a strong foundation to tackle more advanced GraphQL concepts. You could connect your API to a real database like PostgreSQL with Prisma, add user authentication and authorization, implement real-time features with subscriptions, or build custom scalar types for your specific needs.

The [Mercurius documentation](https://mercurius.dev/) has detailed guides for advanced features, and the [Fastify ecosystem](https://fastify.dev/ecosystem/) offers plugins for everything from database connections to authentication.
