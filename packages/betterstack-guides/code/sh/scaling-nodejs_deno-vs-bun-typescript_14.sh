# Source: https://betterstack.com/community/guides/scaling-nodejs/deno-vs-bun-typescript/
# Original language: bash
# Normalized: sh
# Block index: 14

# TypeScript-aware package management
bun install                  # Ultra-fast with .d.ts resolution
bun add express @types/express # Automatic type package detection
bun run tsc                  # TypeScript compilation when needed