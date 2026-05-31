# Source: https://betterstack.com/community/guides/scaling-python/introduction-to-flask/
# Original language: command
# Normalized: sh
# Block index: 42

curl -X PUT http://127.0.0.1:5000/api/posts/3257de2a-ddae-4070-90d4-1b04a367bb07 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Blog Post Title","content":"This content has been updated. Flask makes updating API resources easy!"}' \
  | python3 -m json.tool