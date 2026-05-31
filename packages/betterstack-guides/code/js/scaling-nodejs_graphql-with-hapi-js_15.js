# Source: https://betterstack.com/community/guides/scaling-nodejs/graphql-with-hapi-js/
# Original language: javascript
# Normalized: js
# Block index: 15

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