# Source: https://betterstack.com/community/guides/scaling-nodejs/graphql-with-hapi-js/
# Original language: javascript
# Normalized: js
# Block index: 3

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