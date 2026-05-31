# Source: https://betterstack.com/community/guides/scaling-nodejs/graphql-express/
# Original language: javascript
# Normalized: js
# Block index: 14

[label server.js]
...
import { ruruHTML } from 'ruru/server';
import { 
  UserType, 
  users, 
  [highlight]
  AuthorType, 
  BookType, 
  authors, 
  books
  [/highlight]
} from './types.js';

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    hello: {
      type: GraphQLString,
      resolve: () => 'Hello, GraphQL with Express!'
    },
    users: {
      type: new GraphQLList(UserType),
      resolve: () => users
    },
    user: {
      type: UserType,
      args: { id: { type: new GraphQLNonNull(GraphQLInt) } },
      resolve: (parent, args) => users.find(user => user.id === args.id)
    },
    [highlight]
    books: {
      type: new GraphQLList(BookType),
      resolve: () => books
    },
    book: {
      type: BookType,
      args: { id: { type: new GraphQLNonNull(GraphQLInt) } },
      resolve: (parent, args) => books.find(book => book.id === args.id)
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve: () => authors
    },
    author: {
      type: AuthorType,
      args: { id: { type: new GraphQLNonNull(GraphQLInt) } },
      resolve: (parent, args) => authors.find(author => author.id === args.id)
    }
    [/highlight]
  }
});

...