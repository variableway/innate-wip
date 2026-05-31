# Source: https://betterstack.com/community/guides/scaling-nodejs/graphql-express/
# Original language: javascript
# Normalized: js
# Block index: 13

[label types.js]
import { 
  GraphQLObjectType, 
  GraphQLString, 
  GraphQLInt, 
  GraphQLNonNull,
  [highlight]
  GraphQLList
  [/highlight]
} from 'graphql';

[highlight]
export const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    books: {
      type: new GraphQLList(BookType),
      resolve: (parent) => books.filter(book => book.authorId === parent.id)
    }
  })
});

export const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    isbn: { type: new GraphQLNonNull(GraphQLString) },
    publishedYear: { type: new GraphQLNonNull(GraphQLInt) },
    author: {
      type: AuthorType,
      resolve: (parent) => authors.find(author => author.id === parent.authorId)
    }
  })
});
[/highlight]

export const UserType = new GraphQLObjectType({
  ...
});

[highlight]
// Sample data
export const authors = [
  { id: 1, name: 'Margaret Atwood', email: 'margaret@example.com' },
  { id: 2, name: 'Haruki Murakami', email: 'haruki@example.com' }
];

export const books = [
  { id: 1, title: 'The Handmaid\'s Tale', isbn: '978-0-385-49081-8', publishedYear: 1985, authorId: 1 },
  { id: 2, title: 'Norwegian Wood', isbn: '978-0-375-70427-8', publishedYear: 1987, authorId: 2 },
  { id: 3, title: 'Oryx and Crake', isbn: '978-0-385-50385-4', publishedYear: 2003, authorId: 1 }
];
[/highlight]

// Sample data for demonstration
export const users = [
  ...
];