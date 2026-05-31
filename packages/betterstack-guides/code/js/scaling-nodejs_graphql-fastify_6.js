# Source: https://betterstack.com/community/guides/scaling-nodejs/graphql-fastify/
# Original language: javascript
# Normalized: js
# Block index: 6

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