# Source: https://betterstack.com/community/guides/scaling-nodejs/bun-vs-tsx/
# Original language: bash
# Normalized: sh
# Block index: 8

# Bun production deployment
bun server.ts                 # Direct production execution
docker run -it bun-app       # Container deployment

# Production advantages:
# - No compilation step needed
# - Faster cold starts
# - Lower memory usage
# - Built-in performance optimizations