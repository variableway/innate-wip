# Source: https://betterstack.com/community/guides/scaling-nodejs/graphql-fastify/
# Original language: graphql
# Normalized: js
# Block index: 12

{
  projects {
    id
    title
    owner {
      name
      email
    }
    tasks {
      title
      completed
    }
  }
}