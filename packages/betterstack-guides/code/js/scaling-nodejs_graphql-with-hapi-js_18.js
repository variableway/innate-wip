# Source: https://betterstack.com/community/guides/scaling-nodejs/graphql-with-hapi-js/
# Original language: graphql
# Normalized: js
# Block index: 18

mutation {
  createBook(input: {
    title: "Foundation"
    publishedYear: 1951
    authorId: "3"
  }) {
    id
    title
    publishedYear
    author {
      name
      email
    }
  }
}