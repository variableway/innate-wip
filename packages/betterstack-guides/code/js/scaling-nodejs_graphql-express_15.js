# Source: https://betterstack.com/community/guides/scaling-nodejs/graphql-express/
# Original language: graphql
# Normalized: js
# Block index: 15

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