# Source: https://betterstack.com/community/guides/scaling-nodejs/graphql-express/
# Original language: graphql
# Normalized: js
# Block index: 11

{
  users {
    id
    name
    email
  }
  user(id: 1) {
    name
    role
  }
}