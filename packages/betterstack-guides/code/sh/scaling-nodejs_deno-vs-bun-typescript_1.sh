# Source: https://betterstack.com/community/guides/scaling-nodejs/deno-vs-bun-typescript/
# Original language: bash
# Normalized: sh
# Block index: 1

# Integrated type checking and execution
deno run --allow-net server.ts  # Types checked during execution
deno check server.ts            # Standalone type checking