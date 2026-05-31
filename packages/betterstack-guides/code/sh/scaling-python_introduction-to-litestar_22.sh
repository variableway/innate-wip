# Source: https://betterstack.com/community/guides/scaling-python/introduction-to-litestar/
# Original language: command
# Normalized: sh
# Block index: 22

curl -X POST http://127.0.0.1:8000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"My First Litestar Blog Post","content":"This is the content of my first blog post. Litestar makes API development easy and enjoyable!"}' \
  | python3 -m json.tool