# Source: https://betterstack.com/community/guides/scaling-nodejs/node-clustering/
# Original language: command
# Normalized: sh
# Block index: 6

npx autocannon -d 11 --renderStatusCodes http://localhost:3000/read-content