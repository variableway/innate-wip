# Source: https://betterstack.com/community/guides/scaling-python/introduction-to-litestar/
# Original language: command
# Normalized: sh
# Block index: 28

curl "http://127.0.0.1:8000/api/posts?published=true" | python3 -m json.tool