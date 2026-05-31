# Source: https://betterstack.com/community/guides/scaling-nodejs/pino-vs-bunyan/
# Original language: bash
# Normalized: sh
# Block index: 6

# Pretty-print logs
node app.js | bunyan

# Filter by level
node app.js | bunyan -l warn

# Search logs
node app.js | bunyan -c 'this.user'