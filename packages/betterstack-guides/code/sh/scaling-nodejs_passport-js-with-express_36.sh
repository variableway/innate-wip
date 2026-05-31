# Source: https://betterstack.com/community/guides/scaling-nodejs/passport-js-with-express/
# Original language: command
# Normalized: sh
# Block index: 36

curl -X POST http://localhost:3000/auth/logout \
  -b cookies.txt \
  -s | jq