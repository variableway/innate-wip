# Source: https://betterstack.com/community/guides/scaling-nodejs/bun-vs-nodejs-typescript/
# Original language: bash
# Normalized: sh
# Block index: 4

# Bun's integrated package manager
bun install                      # 10-25x faster than npm
bun add react @types/react       # Instant dependency addition
bun update                       # Lightning-fast updates

# Performance benefits:
# - Global cache optimization
# - Parallel processing
# - Intelligent dependency resolution
# - Full npm registry compatibility