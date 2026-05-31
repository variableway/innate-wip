# Source: https://betterstack.com/community/guides/scaling-nodejs/graphql-with-hapi-js/
# Original language: javascript
# Normalized: js
# Block index: 12

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