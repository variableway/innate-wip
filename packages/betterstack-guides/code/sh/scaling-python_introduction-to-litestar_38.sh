# Source: https://betterstack.com/community/guides/scaling-python/introduction-to-litestar/
# Original language: command
# Normalized: sh
# Block index: 38

curl -X PUT http://127.0.0.1:8000/api/posts/692381d2-9397-4eac-9b97-32598d648475 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Blog Post Title","content":"This content has been updated. Litestar makes updating API resources easy!"}' \
  | python3 -m json.tool