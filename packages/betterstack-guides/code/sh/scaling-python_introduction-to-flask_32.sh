# Source: https://betterstack.com/community/guides/scaling-python/introduction-to-flask/
# Original language: command
# Normalized: sh
# Block index: 32

curl "http://127.0.0.1:5000/api/posts?published=true" | python3 -m json.tool