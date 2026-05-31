# Source: https://betterstack.com/community/guides/scaling-nodejs/graphql-express/
# Original language: javascript
# Normalized: js
# Block index: 10

[label server.js]
import express from 'express';
[highlight]
import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt, GraphQLNonNull } from 'graphql';
[/highlight]
import { createHandler } from 'graphql-http/lib/use/express';
import { ruruHTML } from 'ruru/server';
import { UserType, users } from './types.js';

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    hello: {
      type: GraphQLString,
      resolve: () => 'Hello, GraphQL with Express!'
    },
    [highlight]
    users: {
      type: new GraphQLList(UserType),
      resolve: () => users
    },
    user: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve: (parent, args) => users.find(user => user.id === args.id)
    }
    [/highlight]
  }
});

...