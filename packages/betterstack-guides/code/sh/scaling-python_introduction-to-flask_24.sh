# Source: https://betterstack.com/community/guides/scaling-python/introduction-to-flask/
# Original language: command
# Normalized: sh
# Block index: 24

curl -X POST http://127.0.0.1:5000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"My First Blog Post","content":"This is the content of my first blog post. Flask makes API development easy and enjoyable!"}' \
  | python3 -m json.tool