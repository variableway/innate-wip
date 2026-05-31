# Source: https://betterstack.com/community/guides/scaling-nodejs/fastify-web-api/
# Original language: command
# Normalized: sh
# Block index: 42

curl -X PUT http://localhost:3000/api/posts/PASTE_YOUR_POST_ID_HERE \
  -H "Content-Type: application/json" \
  -d '{"title":"Hi","content":"This content is valid but the title is too short."}' \
  -s | jq