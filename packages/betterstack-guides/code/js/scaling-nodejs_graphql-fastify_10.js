# Source: https://betterstack.com/community/guides/scaling-nodejs/graphql-fastify/
# Original language: javascript
# Normalized: js
# Block index: 10

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