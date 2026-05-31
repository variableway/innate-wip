# Source: https://betterstack.com/community/guides/scaling-nodejs/fastify-web-api/
# Original language: command
# Normalized: sh
# Block index: 40

curl -X PUT http://localhost:3000/api/posts/PASTE_YOUR_POST_ID_HERE \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Blog Post Title","content":"This content has been updated. Fastify makes updating API resources easy!","published":false}' \
  -s | jq