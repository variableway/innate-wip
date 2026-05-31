# Source: https://betterstack.com/community/guides/scaling-nodejs/graphql-fastify/
# Original language: javascript
# Normalized: js
# Block index: 15

[label app.js]
import fastify from 'fastify';
import { schema, users, projects, tasks } from './types.js';

const app = fastify({ logger: true });

[highlight]
let nextId = 4;
[/highlight]

const resolvers = {
  Query: {
    hello: async () => 'Hello, Fastify with GraphQL!',
    users: async () => users,
    user: async (parent, args) => users.find(user => user.id === args.id),
    projects: async () => projects,
    project: async (parent, args) => projects.find(project => project.id === args.id)
  },
  
  [highlight]
  Mutation: {
    createUser: async (parent, args, context) => {
      const { input } = args;
      context.app.log.info('Creating user', input);
      
      // Check if email already exists
      const existingUser = users.find(user => user.email === input.email);
      if (existingUser) {
        throw new Error('Email already exists');
      }
      
      const newUser = {
        id: nextId.toString(),
        ...input
      };
      
      users.push(newUser);
      nextId++;
      
      return newUser;
    }
  },
  [/highlight]
  
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
};

app.register(import('mercurius'), {
  schema,
  resolvers,
  graphiql: true
});

...