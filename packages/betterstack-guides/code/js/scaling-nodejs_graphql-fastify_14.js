# Source: https://betterstack.com/community/guides/scaling-nodejs/graphql-fastify/
# Original language: javascript
# Normalized: js
# Block index: 14

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