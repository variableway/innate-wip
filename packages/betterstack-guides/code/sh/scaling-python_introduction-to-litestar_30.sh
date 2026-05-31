# Source: https://betterstack.com/community/guides/scaling-python/introduction-to-litestar/
# Original language: command
# Normalized: sh
# Block index: 30

curl "http://127.0.0.1:8000/api/posts?published=false" | python3 -m json.tool