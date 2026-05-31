# Source: https://betterstack.com/community/guides/scaling-nodejs/graphql-express/
# Original language: javascript
# Normalized: js
# Block index: 7

[label server.js]
import express from 'express';
import { GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql';
import { createHandler } from 'graphql-http/lib/use/express';
import { ruruHTML } from 'ruru/server';
[highlight]
import { UserType, users } from './types.js';
[/highlight]

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    hello: {
      type: GraphQLString,
      resolve: () => 'Hello, GraphQL with Express!'
    },
    [highlight]
    user: {
      type: UserType,
      resolve: () => users[0]
    }
    [/highlight]
  }
});

const schema = new GraphQLSchema({ query: Query });
...