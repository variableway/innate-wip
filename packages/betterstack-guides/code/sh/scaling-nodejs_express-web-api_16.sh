# Source: https://betterstack.com/community/guides/scaling-nodejs/express-web-api/
# Original language: command
# Normalized: sh
# Block index: 16

curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"My First Blog Post","content":"This is the content of my first blog post. Express makes API development easy and enjoyable!"}' \
  -s | jq