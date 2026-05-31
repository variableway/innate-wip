# Source: https://betterstack.com/community/guides/scaling-nodejs/graphql-with-hapi-js/
# Original language: javascript
# Normalized: js
# Block index: 10

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