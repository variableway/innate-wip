# Source: https://betterstack.com/community/guides/scaling-nodejs/passport-js-with-express/
# Original language: command
# Normalized: sh
# Block index: 43

curl http://localhost:3000/auth/profile \
  -b cookies.txt \
  -s | jq