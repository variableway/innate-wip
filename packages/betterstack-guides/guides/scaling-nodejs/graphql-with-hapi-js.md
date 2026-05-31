# Setting up GraphQL with Hapi.js

[Hapi.js](https://hapi.dev/) is a strong Node.js framework that is great for creating enterprise-level APIs with its configuration-focused design, built-in security features, and wide range of plugins.

When paired with [GraphQL](https://graphql.org/), Hapi.js becomes a powerful foundation for building complex, scalable APIs that provide accurate data fetching while retaining the framework's well-known reliability and developer experience.

This detailed tutorial guides you through building production-ready GraphQL APIs with Hapi.js and modern GraphQL tools, emphasizing real-world patterns and best practices.

[ad-logs]

## Prerequisites

Before starting, make sure you have [Node.js 18](https://nodejs.org/en/download/) or a newer version installed on your system. This guide assumes you are familiar with JavaScript ES6+ features, async/await patterns, and basic API development concepts.

## Setting up your Hapi.js GraphQL project

Following along with hands-on examples will maximize your learning experience, so let's set up a new Hapi.js project where you can try out each concept as we go.

Start by creating a specific directory for your project and initializing the Node.js environment.

```command
mkdir hapi-graphql-api && cd hapi-graphql-api
```

```command
npm init -y
```

Install the essential dependencies for GraphQL with Apollo Server:

```command
npm install @apollo/server graphql
```

```command
npm install -D @types/node
```

Let's examine what each package contributes to our setup:

* `@apollo/server`: Apollo Server v4+ with built-in standalone server capabilities.
* `graphql`: The reference implementation of GraphQL for JavaScript, handling schema parsing and query execution.

Create a `server.js` file in your project root and establish the foundational server structure:

```javascript
[label server.js]
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

// Define GraphQL schema using template literals
const typeDefs = `
  type Book {
    id: ID!
    title: String!
    author: String!
  }

  type Query {
    books: [Book!]!
    hello(name: String = "World"): String!
  }
`;

// Implement resolvers for schema fields
const resolvers = {
  Query: {
    books: () => [
      { id: '1', title: '1984', author: 'George Orwell' },
      { id: '2', title: 'Fahrenheit 451', author: 'Ray Bradbury' }
    ],
    hello: (parent, { name }) => `Hello, ${name}! Welcome to Apollo Server + GraphQL`
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 }
});

console.log(`Server running at: ${url}`);
```

This implementation uses Apollo Server's built-in standalone server, which provides a simple, reliable way to run a GraphQL API without requiring additional framework integrations. The standalone server includes built-in CORS support and request handling, making it perfect for getting started quickly.

The configuration demonstrates Hapi's declarative approach - we specify server parameters and plugin registration through clear, object-based configuration rather than imperative middleware chains.

Add a development script to your `package.json` to streamline the development workflow:

```json
[label package.json]
{
  ...
[highlight]
  "type": "module",
  "scripts": {
    "dev": "node --watch server.js",
    "start": "node server.js"
  }
[/highlight]

}
```

Launch your GraphQL server using the development command:

```command
npm run dev
```

```text
[output]> hapi-graphql-api@1.0.0 dev
> node --watch server.js

Server running at: http://localhost:4000/
```


Navigate to `http://localhost:4000/graphql` in your browser to access Apollo Studio, an advanced GraphQL IDE that provides schema exploration, query composition, and debugging capabilities:

![Apollo Studio interface showing the GraphQL playground](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/29101aee-8b90-4ec3-6677-b9e233b91300/public =3248x1994)

Execute this query to validate your setup works correctly:

```graphql
{
  books {
    id
    title
    author
  }
}
```

You should receive a structured response:

```json
[output]
{
  "data": {
    "books": [
      {
        "id": "1",
        "title": "1984",
        "author": "George Orwell"
      },
      {
        "id": "2",
        "title": "Fahrenheit 451",
        "author": "Ray Bradbury"
      }
    ]
  }
}
```

![Apollo Studio showing query results with book data](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/c38fc45e-fdde-49f7-7fcc-d27238cf0d00/public =3248x1994)

Apollo Studio's interface offers intelligent features, including autocomplete, real-time schema validation, and comprehensive documentation generation. 

These capabilities significantly enhance the development experience by making API exploration and testing more intuitive and efficient.


## Designing GraphQL schemas

A GraphQL schema is the core contract between your API and its users. It defines all available operations, data types, and how they relate. Unlike REST, which relies on multiple endpoints, GraphQL uses a single, well-structured schema to describe the entire API.

Schemas are made up of types, fields, arguments, and operations like queries and mutations. Understanding these pieces is key to designing clean, scalable APIs.

Let's create a more realistic schema. Start by creating a new file called `models.js` to define our data types.

```javascript
[label models.js]
export const typeDefs = `
  type Author {
    id: ID!
    name: String!
    email: String!
    books: [Book!]!
  }

  type Book {
    id: ID!
    title: String!
    publishedYear: Int!
    author: Author!
    authorId: ID!
  }
`;
```

These type definitions highlight key GraphQL concepts. `Author` and `Book` show how to create object types with scalar fields (like `ID` and `String`) and relationships to other types. The use of exclamation marks (`!`) indicates required fields, while their absence denotes optional fields that may return null values.

We're also using relationships throughout. The `books` field on `Author` returns a list of books, while the `author` field on `Book` returns the related author. This demonstrates GraphQL's power to traverse relationships and return exactly the data requested by the client.

Next, let's define input types for mutations. Input types are used to pass structured arguments into queries and mutations. Add the following to your `models.js` file:

```javascript
[label models.js]
export const typeDefs = `
  type Author {
    id: ID!
    name: String!
    email: String!
    books: [Book!]!
  }

  type Book {
    id: ID!
    title: String!
    publishedYear: Int!
    author: Author!
    authorId: ID!
  }

  [highlight]
  input CreateAuthorInput {
    name: String!
    email: String!
  }

  input CreateBookInput {
    title: String!
    publishedYear: Int!
    authorId: ID!
  }
  [/highlight]
`;
```

Input types offer several advantages over using individual arguments: they group related parameters together, make mutations more readable, and facilitate easier validation and transformation.

Update your `server.js` file to include these new types and provide some sample data to work with:

```javascript
[label server.js]
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
[highlight]
import { typeDefs } from './models.js';

// Sample data for demonstration
const authors = [
  {
    id: '1',
    name: 'George Orwell',
    email: 'george@orwell.com'
  },
  {
    id: '2',
    name: 'Ray Bradbury',
    email: 'ray@bradbury.com'
  }
];

const books = [
  {
    id: '1',
    title: '1984',
    publishedYear: 1949,
    authorId: '1'
  },
  {
    id: '2',
    title: 'Fahrenheit 451',
    publishedYear: 1953,
    authorId: '2'
  }
];

// Define GraphQL schema using template literals
const queryDefs = `
  type Query {
    books: [Book!]!
    book(id: ID!): Book
    authors: [Author!]!
    author(id: ID!): Author
    hello(name: String = "World"): String!
  }
`;
[/highlight]

// Implement resolvers for schema fields
const resolvers = {
  Query: {
    [highlight]
    books: () => books,
    book: (parent, { id }) => books.find(book => book.id === id),
    authors: () => authors,
    author: (parent, { id }) => authors.find(author => author.id === id),
    [/highlight]
    hello: (parent, { name }) => `Hello, ${name}! Welcome to Apollo Server + GraphQL`
  }
};

const server = new ApolloServer({
  [highlight]
  typeDefs: [typeDefs, queryDefs],
  [/highlight]
  resolvers
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 }
});

console.log(`Server running at: ${url}`);
```

This enhanced schema demonstrates several important query patterns. The `books` and `authors` fields return lists of items, while `book` and `author` provide single-item lookups by ID. The modular approach separates type definitions from query definitions, making the code more maintainable.

If you try to test your enhanced schema with this query:

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

You might encounter an error like "Cannot return null for non-nullable field Book.author." This happens because our schema defines the `author` field as required (`Author!`) but we haven't implemented the relationship resolution yet. Let's add resolver methods to handle these relationships properly:

```javascript
[label server.js]
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
...
// Implement resolvers for schema fields
const resolvers = {
  Query: {
    books: () => books,
    book: (parent, { id }) => books.find(book => book.id === id),
    authors: () => authors,
    author: (parent, { id }) => authors.find(author => author.id === id),
    hello: (parent, { name }) => `Hello, ${name}! Welcome to Apollo Server + GraphQL`
  },
  [highlight]
  Book: {
    author: (parent) => {
      const author = authors.find(author => author.id === parent.authorId);
      if (!author) {
        throw new Error(`Author with ID ${parent.authorId} not found`);
      }
      return author;
    }
  },
  Author: {
    books: (parent) => books.filter(book => book.authorId === parent.id)
  }
  [/highlight]
};

const server = new ApolloServer({
  typeDefs: [typeDefs, queryDefs],
  resolvers
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 }
});

console.log(`Server running at: ${url}`);
```

Now, when you run the same query:

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

You'll see the author information populated for each book:

```text
[output]
{
  "data": {
    "books": [
      {
        "id": "1",
        "title": "1984",
        "publishedYear": 1949,
        "author": {
          "name": "George Orwell",
          "email": "george@orwell.com"
        }
      },
      {
        "id": "2",
        "title": "Fahrenheit 451",
        "publishedYear": 1953,
        "author": {
          "name": "Ray Bradbury",
          "email": "ray@bradbury.com"
        }
      }
    ]
  }
}
```

![Screenshot in the GraphQL interface showing the author information populated](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/e90b580a-fa8e-4974-c690-9da8c5bbd400/md1x =3248x1994)

This demonstrates GraphQL's power to traverse relationships and return exactly the data requested by the client. 

The error handling in the resolver ensures that if there are any data integrity issues, they're caught and reported clearly rather than causing silent failures.

## Implementing mutations for data modification

While queries handle data retrieval, mutations manage data modifications such as creating, updating, or deleting resources. GraphQL mutations provide a structured approach to state changes while maintaining the same type safety and flexibility as queries.

Mutations are particularly powerful because they can return complex objects that include both the modified data and additional context like validation errors or related information that changed as a result of the operation.

Let's add comprehensive mutation capabilities to our API. First, add a `Mutation` type to your query definitions:

```javascript
[label server.js]
...
// Define GraphQL schema using template literals
const queryDefs = `
  type Query {
    books: [Book!]!
    book(id: ID!): Book
    authors: [Author!]!
    author(id: ID!): Author
    hello(name: String = "World"): String!
  }

  [highlight]
  type Mutation {
    createAuthor(input: CreateAuthorInput!): Author!
    createBook(input: CreateBookInput!): Book!
  }
  [/highlight]
`;

// Implement resolvers for schema fields
const resolvers = {
  Query: {
    books: () => books,
    book: (parent, { id }) => books.find(book => book.id === id),
    authors: () => authors,
    author: (parent, { id }) => authors.find(author => author.id === id),
    hello: (parent, { name }) => `Hello, ${name}! Welcome to Apollo Server + GraphQL`
  },
  [highlight]
  Mutation: {
    createAuthor: (parent, { input }) => {
      const newId = (Math.max(...authors.map(a => parseInt(a.id))) + 1).toString();
      const newAuthor = {
        id: newId,
        ...input
      };
      authors.push(newAuthor);
      return newAuthor;
    },
    createBook: (parent, { input }) => {
      // Validate that the author exists
      const author = authors.find(a => a.id === input.authorId);
      if (!author) {
        throw new Error(`Author with ID ${input.authorId} not found`);
      }
      
      const newId = (Math.max(...books.map(b => parseInt(b.id))) + 1).toString();
      const newBook = {
        id: newId,
        ...input
      };
      books.push(newBook);
      return newBook;
    }
  },
  [/highlight]
  Book: {
    author: (parent) => {
      ...
  },
  Author: {
    books: (parent) => books.filter(book => book.authorId === parent.id)
  }
};

...
```

The mutation resolvers demonstrate several important patterns. They accept input objects rather than individual parameters, which keeps the GraphQL schema clean and makes validation easier. They perform validation before making changes - the `createBook` mutation verifies that the referenced author exists before creating the book.

Notice how we generate new IDs by finding the maximum existing ID and incrementing it. In a real application, you'd typically let your database handle ID generation, but this approach works well for our demonstration.

Test your mutations with these GraphQL operations:

```graphql
mutation {
  createAuthor(input: {
    name: "Isaac Asimov"
    email: "isaac@asimov.com"
  }) {
    id
    name
    email
  }
}
```

```json
[output]
{
  "data": {
    "createAuthor": {
      "id": "3",
      "name": "Isaac Asimov",
      "email": "isaac@asimov.com"
    }
  }
}
```
![Screenshot of GraphQL result in the browser](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/03b5a6dd-fa9d-41a0-13a0-1e198a72be00/md1x =3248x1994)

Now try creating a book for the new author:

```graphql
mutation {
  createBook(input: {
    title: "Foundation"
    publishedYear: 1951
    authorId: "3"
  }) {
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

```json
[output]
{
  "data": {
    "createBook": {
      "id": "3",
      "title": "Foundation",
      "publishedYear": 1951,
      "author": {
        "name": "Isaac Asimov",
        "email": "isaac@asimov.com"
      }
    }
  }
}
```
![Screenshot of the result from GraphQL](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/eadadfee-db60-445c-b4cc-e8bcdf879d00/public =3248x1994)

The mutation system offers a clear interface for data changes while keeping the same type safety and introspection features that make GraphQL queries so powerful. 

Clients can specify exactly what data they want returned after the mutation finishes, which is especially useful for updating UI components efficiently.

## Final thoughts

You've successfully built a GraphQL API using Apollo Server, covering essential concepts from basic schema design to advanced mutations and relationship handling. This foundation demonstrates GraphQL's power to provide flexible, type-safe APIs that can evolve with your application's needs.


For further exploration, the [Apollo Server documentation](https://www.apollographql.com/docs/apollo-server/) offers comprehensive guides on advanced topics, while the [GraphQL specification](https://graphql.org/learn/) provides deeper insights into the query language itself.