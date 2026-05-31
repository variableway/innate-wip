# Source: https://betterstack.com/community/guides/scaling-nodejs/graphql-with-hapi-js/
# Original language: javascript
# Normalized: js
# Block index: 9

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