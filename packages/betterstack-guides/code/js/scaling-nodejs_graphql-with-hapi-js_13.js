# Source: https://betterstack.com/community/guides/scaling-nodejs/graphql-with-hapi-js/
# Original language: graphql
# Normalized: js
# Block index: 13

{
  books {
    id
    title
    publishedYear
    author {
      name
      email
    }
  }
}