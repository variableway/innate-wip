# Source: https://betterstack.com/community/guides/scaling-nodejs/fastify-web-api/
# Original language: command
# Normalized: sh
# Block index: 24

curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"My First Blog Post","content":"This is the content of my first blog post. Fastify makes API development fast and enjoyable!"}' \
  -s | jq