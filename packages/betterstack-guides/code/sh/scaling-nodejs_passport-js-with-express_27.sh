# Source: https://betterstack.com/community/guides/scaling-nodejs/passport-js-with-express/
# Original language: command
# Normalized: sh
# Block index: 27

curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass123"}' \
  -c cookies.txt \
  -s | jq