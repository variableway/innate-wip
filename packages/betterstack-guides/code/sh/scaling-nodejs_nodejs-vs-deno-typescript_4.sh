# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-vs-deno-typescript/
# Original language: bash
# Normalized: sh
# Block index: 4

# Deno: comprehensive type checking built-in
deno check app.ts              # Type check single file
deno check --remote deps.ts    # Include remote dependencies
deno run --check app.ts        # Check during execution