# Source: https://betterstack.com/community/guides/scaling-nodejs/pino-vs-bunyan/
# Original language: bash
# Normalized: sh
# Block index: 7

# Development with pretty printing
node app.js | pino-pretty

# Production logging with post-processing
node app.js > app.log
cat app.log | pino-pretty --colorize