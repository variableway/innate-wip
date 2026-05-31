# Source: https://betterstack.com/community/guides/scaling-nodejs/express-web-api/
# Original language: command
# Normalized: sh
# Block index: 29

curl -X PUT http://localhost:3000/api/posts/PASTE_POST_ID_HERE \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Blog Post Title","content":"This content has been updated. Express makes updating API resources easy!"}' \
  -s | jq