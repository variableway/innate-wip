# Source: https://betterstack.com/community/guides/scaling-nodejs/bun-vs-ts-node-typescript/
# Original language: bash
# Normalized: sh
# Block index: 4

# Bun handles all module formats seamlessly
bun modern-esm-app.ts            # Pure ESM TypeScript
bun mixed-modules.ts             # ESM importing CommonJS
bun legacy-commonjs.ts           # Traditional CommonJS

# TypeScript ESM imports work naturally
import { createServer } from './server.ts'    # .ts extension supported
import type { UserConfig } from './types.ts'  # Type-only imports