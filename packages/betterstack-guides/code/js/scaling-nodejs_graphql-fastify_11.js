# Source: https://betterstack.com/community/guides/scaling-nodejs/graphql-fastify/
# Original language: javascript
# Normalized: js
# Block index: 11

[label app.js]
import fastify from 'fastify';
[highlight]
import { schema, users, projects, tasks } from './types.js';
[/highlight] 
const app = fastify({ logger: true });

const resolvers = {
  Query: {
    hello: async () => 'Hello, Fastify with GraphQL!',
    users: async () => users,
    user: async (parent, args) => users.find(user => user.id === args.id),
    [highlight]
    projects: async () => projects,
    project: async (parent, args) => projects.find(project => project.id === args.id)
    [/highlight]
  },
  
  [highlight]
  User: {
    projects: async (parent) => projects.filter(project => project.ownerId === parent.id)
  },
  
  Project: {
    owner: async (parent) => users.find(user => user.id === parent.ownerId),
    tasks: async (parent) => tasks.filter(task => task.projectId === parent.id)
  },
  
  Task: {
    project: async (parent) => projects.find(project => project.id === parent.projectId)
  }
  [/highlight]
};

app.register(import('mercurius'), {
  schema,
  resolvers,
  graphiql: true
});

...