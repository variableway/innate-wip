# Source: https://betterstack.com/community/guides/scaling-python/introduction-to-flask/
# Original language: command
# Normalized: sh
# Block index: 31

curl -X POST http://127.0.0.1:5000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Draft Post","content":"This is an unpublished draft post.","published":false}' \
  | python3 -m json.tool