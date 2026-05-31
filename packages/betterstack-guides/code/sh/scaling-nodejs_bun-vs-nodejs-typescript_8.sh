# Source: https://betterstack.com/community/guides/scaling-nodejs/bun-vs-nodejs-typescript/
# Original language: bash
# Normalized: sh
# Block index: 8

# Bun production deployment
bun server.ts                    # Direct production execution
bun build ./src --outdir ./dist  # Optional bundling for optimization

# Deployment advantages:
# - Single binary distribution
# - Faster cold start times
# - Reduced memory footprint
# - Built-in performance optimizations