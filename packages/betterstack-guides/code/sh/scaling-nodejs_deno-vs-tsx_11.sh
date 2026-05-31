# Source: https://betterstack.com/community/guides/scaling-nodejs/deno-vs-tsx/
# Original language: bash
# Normalized: sh
# Block index: 11

# Deno explicit permission model
deno run --allow-net --allow-read=./data server.ts
deno run --allow-all server.ts  # Explicit full access grant