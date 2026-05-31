# Source: https://betterstack.com/community/guides/scaling-nodejs/graphql-with-hapi-js/
# Original language: graphql
# Normalized: js
# Block index: 16

mutation {
  createAuthor(input: {
    name: "Isaac Asimov"
    email: "isaac@asimov.com"
  }) {
    id
    name
    email
  }
}