# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-prometheus/
# Original language: command
# Normalized: sh
# Block index: 27

curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user1","password":"password1"}' \
  -c cookies.txt