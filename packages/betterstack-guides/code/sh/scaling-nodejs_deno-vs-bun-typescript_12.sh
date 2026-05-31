# Source: https://betterstack.com/community/guides/scaling-nodejs/deno-vs-bun-typescript/
# Original language: bash
# Normalized: sh
# Block index: 12

# No package installation - direct execution
deno run --allow-net server.ts
deno cache deps.ts           # Cache for offline use
deno info                    # Show dependency graph