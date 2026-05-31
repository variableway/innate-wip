# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-memory-leaks/
# Original language: command
# Normalized: sh
# Block index: 27

npx loadtest -n 7000 -c 1 -k http://localhost:3000/