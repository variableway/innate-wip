# Source: https://betterstack.com/community/guides/scaling-nodejs/graphql-express/
# Original language: javascript
# Normalized: js
# Block index: 3

[label server.js]
import express from 'express';
import { GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql';
import { createHandler } from 'graphql-http/lib/use/express';
import { ruruHTML } from 'ruru/server';

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    hello: {
      type: GraphQLString,
      resolve: () => 'Hello, GraphQL with Express!'
    }
  }
});

const schema = new GraphQLSchema({ query: Query });

const app = express();

// GraphQL endpoint
app.all('/graphql', createHandler({ schema }));

// Serve GraphiQL IDE
app.get('/', (_req, res) => {
  res.type('html');
  res.end(ruruHTML({ endpoint: '/graphql' }));
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/graphql`);
  console.log(`GraphiQL IDE available at http://localhost:${PORT}/`);
});