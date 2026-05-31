# Source: https://betterstack.com/community/guides/scaling-nodejs/jiti-vs-tsx/
# Original language: bash
# Normalized: sh
# Block index: 10

# Jiti can include type checking in execution
JITI_TYPE_CHECK=true npx jiti ./app.ts

# Or skip for performance
npx jiti ./app.ts  # Fast execution without type checks