# Source: https://betterstack.com/community/guides/scaling-nodejs/bun-vs-tsx/
# Original language: bash
# Normalized: sh
# Block index: 9

# TSX development workflow
tsx watch src/app.ts         # Development
tsx --test                   # Testing

# Production requires compilation
tsc                          # Compile for production  
node dist/app.js            # Run compiled JavaScript