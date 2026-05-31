# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-prometheus/
# Original language: command
# Normalized: sh
# Block index: 8

curl -X POST http://localhost:3000/logout \
  -b cookies.txt \
  -H "Content-Type: application/json" \
  -d '{}'