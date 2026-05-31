# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-caching-redis/
# Original language: command
# Normalized: sh
# Block index: 33

curl -X PUT -H "Content-Type: application/json" \
-d '{"bio": "New bio for John Doe"}' \
http://localhost:5000/users/1/bio