# Source: https://betterstack.com/community/guides/scaling-nodejs/passport-js-with-express/
# Original language: command
# Normalized: sh
# Block index: 31

curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"anotherpass"}' \
  -s | jq