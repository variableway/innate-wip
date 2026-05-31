# Source: https://betterstack.com/community/guides/scaling-nodejs/graphql-fastify/
# Original language: graphql
# Normalized: js
# Block index: 16

mutation {
  createUser(input: {
    name: "Sarah Davis"
    email: "sarah@example.com"
    role: "analyst"
  }) {
    id
    name
    email
    role
  }
}