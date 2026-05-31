# Source: https://betterstack.com/community/guides/scaling-nodejs/fastify-web-api/
# Original language: command
# Normalized: sh
# Block index: 26

curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Hi","content":"This content is valid but the title is too short."}' \
  -s | jq