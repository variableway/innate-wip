# Source: https://betterstack.com/community/guides/scaling-nodejs/bun-vs-ts-node-typescript/
# Original language: bash
# Normalized: sh
# Block index: 10

# Bun TypeScript setup
curl -fsSL https://bun.sh/install | bash  # One-line install
bun run app.ts                           # Run any TypeScript file immediately

# Configuration when you need it:
# - Automatically reads tsconfig.json if present
# - Works perfectly without any configuration
# - Respects your TypeScript compiler options when provided