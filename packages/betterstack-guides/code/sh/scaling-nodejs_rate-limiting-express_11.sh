# Source: https://betterstack.com/community/guides/scaling-nodejs/rate-limiting-express/
# Original language: command
# Normalized: sh
# Block index: 11

curl -i -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"wrong","password":"incorrect"}'