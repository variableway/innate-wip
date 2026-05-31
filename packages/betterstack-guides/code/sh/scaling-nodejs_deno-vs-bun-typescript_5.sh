# Source: https://betterstack.com/community/guides/scaling-nodejs/deno-vs-bun-typescript/
# Original language: bash
# Normalized: sh
# Block index: 5

# Complete TypeScript workflow
deno run --allow-net api.ts    # Execute with type stripping
deno check api.ts              # Built-in type checking  
deno check --all               # Check including npm packages
deno fmt api.ts                # Format TypeScript
deno lint api.ts               # Lint TypeScript code