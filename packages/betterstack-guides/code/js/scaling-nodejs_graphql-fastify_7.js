# Source: https://betterstack.com/community/guides/scaling-nodejs/graphql-fastify/
# Original language: javascript
# Normalized: js
# Block index: 7

[label app.js]
import fastify from 'fastify';
[highlight]
import { schema, users } from './types.js';
[/highlight]

const app = fastify({ logger: true });
[highlight]
// remove the schema variable around here
[/highlight]
const resolvers = {
  Query: {
    hello: async () => 'Hello, Fastify with GraphQL!',
    [highlight]
    users: async () => users,
    user: async (parent, args) => users.find(user => user.id === args.id)
    [/highlight]
  }
};

...