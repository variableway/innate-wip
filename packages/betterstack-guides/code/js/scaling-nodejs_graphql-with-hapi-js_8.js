# Source: https://betterstack.com/community/guides/scaling-nodejs/graphql-with-hapi-js/
# Original language: javascript
# Normalized: js
# Block index: 8

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