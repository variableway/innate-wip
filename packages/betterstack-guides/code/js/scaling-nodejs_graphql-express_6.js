# Source: https://betterstack.com/community/guides/scaling-nodejs/graphql-express/
# Original language: javascript
# Normalized: js
# Block index: 6

[label types.js]
import { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLNonNull } from 'graphql';

export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    role: { type: GraphQLString }
  }
});

// Sample data for demonstration
export const users = [
  { id: 1, name: 'Sarah Chen', email: 'sarah@example.com', role: 'developer' },
  { id: 2, name: 'Mike Johnson', email: 'mike@example.com', role: 'designer' },
  { id: 3, name: 'Emma Wilson', email: 'emma@example.com', role: 'manager' }
];