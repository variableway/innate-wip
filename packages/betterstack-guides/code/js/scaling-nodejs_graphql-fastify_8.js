# Source: https://betterstack.com/community/guides/scaling-nodejs/graphql-fastify/
# Original language: graphql
# Normalized: js
# Block index: 8

{
  users {
    id
    name
    email
  }
  user(id: "1") {
    name
    role
  }
}